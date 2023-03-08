import type { LikePostResponse, ServerLike } from '$lib/zod/Like';
import { Account } from './Account';
import { Fauna, q } from './Fauna';
import { Invoice } from './Invoice';
import { Nametag } from './Nametag';
import { Post } from './Post';

export class Like {
  static mint_count = 10;
  static collection = 'likes';

  static async doesLikePost(nametag_id: string, post_id: string) {
    const exists = await Fauna.one<ServerLike>(
      'is_post_liked',
      [Nametag.toRef(nametag_id), Post.toRef(post_id)],
      Like.parseFQL
    );

    if (exists) return exists.id;
    return false;
  }

  static async nextAvailable(account_id: string) {
    return await Fauna.one<ServerLike>(
      'likes_by_nametag_ref_and_availability',
      [Account.toRef(account_id), true],
      Like.parseFQL
    );
  }

  static async mint(nametag_id: string, invoice_id: string) {
    const likes_to_mint: Partial<ServerLike>[] = [];

    for (let i = 0; i < Like.mint_count; i++) {
      likes_to_mint.push({
        nametag_ref: Nametag.toRef(nametag_id),
        invoice_ref: Invoice.toRef(invoice_id),
        available: true
      });
    }

    try {
      await Fauna.client().query(
        q.Foreach(
          likes_to_mint,
          q.Lambda(
            'like',
            q.Create(q.Collection(Like.collection), { data: q.Var('like') })
          )
        )
      );

      await Invoice.update(invoice_id, { minted: true });

      return true;
    } catch (e) {
      console.log('> fauna error');
      console.error(e);
      return false;
    }
  }

  // update a Like record to point to a post ID
  // things to update: post stats, account stats (likes), the record itself
  static async likePost(
    nametag_id: string,
    post_id: string
  ): Promise<LikePostResponse> {
    try {
      return await Fauna.client().query<LikePostResponse>(
        q.Let(
          {
            // performance matters here, so null-check subsequent variables
            // because we bail out early in the response
            // (it looks complex but just check the var's if() dependency and you
            // can then safely rely on that variable)
            nametag_ref: Nametag.toRef(nametag_id),
            next_available_set: q.Match(
              q.Index('likes_by_nametag_ref_and_availability'),
              [Nametag.toRef(nametag_id), true]
            ),
            has_next_available: q.Exists(q.Var('next_available_set')),
            next_available: q.If(
              q.Var('has_next_available'),
              q.Get(q.Var('next_available_set')),
              null
            ),
            next_available_ref: q.If(
              q.Var('has_next_available'),
              q.Select(['ref'], q.Var('next_available')),
              null
            ),
            post_ref: q.If(q.Var('has_next_available'), Post.toRef(post_id), null),
            post_exists: q.If(
              q.IsNull(q.Var('post_ref')),
              false,
              q.Exists(q.Var('post_ref'))
            ),
            post: q.If(q.Var('post_exists'), q.Get(q.Var('post_ref')), null),
            post_settings_likes_enabled: q.If(
              q.Var('post_exists'),
              q.Select(['data', 'settings', 'enable_likes'], q.Var('post')),
              false
            ),
            post_stats_ref: q.If(
              q.IsNull(q.Var('post')),
              null,
              q.Select(['data', 'stats_ref'], q.Var('post'))
            ),
            has_post_stats: q.If(
              q.IsNull(q.Var('post_stats_ref')),
              false,
              q.Exists(q.Var('post_stats_ref'))
            ),
            post_stats: q.If(
              q.Var('has_post_stats'),
              q.Get(q.Var('post_stats_ref')),
              null
            ),
            // nametag that's receiving the like, pulled off the post
            target_nametag_ref: q.If(
              q.Var('post_settings_likes_enabled'),
              q.Select(['data', 'nametag_ref'], q.Var('post')),
              null
            ),
            has_target_nametag: q.If(
              q.IsNull(q.Var('target_nametag_ref')),
              false,
              q.Exists(q.Var('target_nametag_ref'))
            ),
            target_nametag: q.If(
              q.Var('has_target_nametag'),
              q.Get(q.Var('target_nametag_ref')),
              null
            ),
            target_nametag_stats_ref: q.If(
              q.Var('has_target_nametag'),
              q.Select(['data', 'stats_ref'], q.Var('target_nametag')),
              null
            ),
            has_target_nametag_stats: q.If(
              q.IsNull(q.Var('target_nametag_stats_ref')),
              false,
              q.Exists(q.Var('target_nametag_stats_ref'))
            ),
            target_nametag_stats: q.If(
              q.Var('has_target_nametag_stats'),
              q.Get(q.Var('target_nametag_stats_ref')),
              null
            ),
            target_nametag_likes_received_val: q.If(
              q.Var('has_target_nametag_stats'),
              q.Select(['data', 'likes_received'], q.Var('target_nametag_stats')),
              null
            ),
            target_likes_received: q.If(
              q.IsNull(q.Var('target_nametag_likes_received_val')),
              0,
              q.Var('target_nametag_likes_received_val')
            )
          },
          q.If(
            q.Var('has_next_available'),
            q.If(
              q.And(q.Var('post_settings_likes_enabled'), q.Var('has_post_stats')),
              q.If(
                q.And(
                  q.Var('has_target_nametag'),
                  q.Var('has_target_nametag_stats')
                ),
                q.Do(
                  q.Update(q.Var('next_available_ref'), {
                    data: {
                      available: false,
                      post_ref: q.Var('post_ref'),
                      nametag_ref: q.Var('nametag_ref'),
                      target_nametag_ref: q.Var('target_nametag_ref')
                    }
                  }),
                  q.Update(q.Var('post_stats_ref'), {
                    data: {
                      likes: q.Add(
                        q.Select(['data', 'likes'], q.Var('post_stats')),
                        1
                      )
                    }
                  }),
                  q.Update(q.Var('target_nametag_stats_ref'), {
                    data: {
                      likes_received: q.Add(q.Var('target_likes_received'), 1)
                    }
                  }),
                  {
                    success: true,
                    unlike_key: q.Select(['ref', 'id'], q.Var('next_available'))
                  }
                ),
                { success: false, reason: 'ownership_chain' }
              ),
              { success: false, reason: 'likes_disabled' }
            ),
            { success: false, reason: 'out_of_likes' }
          )
        )
      );
    } catch (e) {
      console.error('[> Like.likePost()]', e);
      return { success: false, reason: 'idk' };
    }
  }

  static async unlike(unlike_key: string, nametag_id: string): Promise<boolean> {
    try {
      return await Fauna.client().query<boolean>(
        q.Let(
          {
            like_ref: Like.toRef(unlike_key),
            like_exists: q.Exists(q.Var('like_ref')),
            like: q.If(q.Var('like_exists'), q.Get(q.Var('like_ref')), null),
            has_like: q.If(q.IsNull(q.Var('like')), false, q.Var('like_exists')),
            like_nametag_ref: q.If(
              q.Var('has_like'),
              q.Select(['data', 'nametag_ref'], q.Var('like')),
              null
            ),
            nametags_match: q.If(
              q.Var('has_like'),
              q.Equals(q.Var('like_nametag_ref'), Nametag.toRef(nametag_id)),
              false
            ),
            has_transferred: q.If(
              q.Var('has_like'),
              q.ContainsPath(['data', 'transferred'], q.Var('like')),
              false
            ),
            is_already_transferred: q.If(
              q.Var('has_transferred'),
              q.Equals(q.Select(['data', 'transferred'], q.Var('like')), true),
              false
            ),
            should_continue: q.And(
              q.Var('has_like'),
              q.Var('nametags_match'),
              q.Equals(q.Var('is_already_transferred'), false)
            ),
            // the rest of this is just repeated from above…
            post_ref: q.If(
              q.Var('should_continue'),
              q.Select(['data', 'post_ref'], q.Var('like'), null),
              null
            ),
            post: q.If(q.Var('should_continue'), q.Get(q.Var('post_ref')), null),
            post_stats_ref: q.If(
              q.IsNull(q.Var('post')),
              null,
              q.Select(['data', 'stats_ref'], q.Var('post'))
            ),
            has_post_stats: q.If(
              q.IsNull(q.Var('post_stats_ref')),
              false,
              q.Exists(q.Var('post_stats_ref'))
            ),
            post_stats: q.If(
              q.Var('has_post_stats'),
              q.Get(q.Var('post_stats_ref')),
              null
            ),
            // nametag that's receiving the like, pulled off the post
            target_nametag_ref: q.If(
              q.Var('has_like'),
              q.Select(['data', 'target_nametag_ref'], q.Var('like')),
              null
            ),
            has_target_nametag: q.If(
              q.IsNull(q.Var('target_nametag_ref')),
              false,
              q.Exists(q.Var('target_nametag_ref'))
            ),
            target_nametag: q.If(
              q.Var('has_target_nametag'),
              q.Get(q.Var('target_nametag_ref')),
              null
            ),
            target_nametag_stats_ref: q.If(
              q.Var('has_target_nametag'),
              q.Select(['data', 'stats_ref'], q.Var('target_nametag')),
              null
            ),
            has_target_nametag_stats: q.If(
              q.IsNull(q.Var('target_nametag_stats_ref')),
              false,
              q.Exists(q.Var('target_nametag_stats_ref'))
            ),
            target_nametag_stats: q.If(
              q.Var('has_target_nametag_stats'),
              q.Get(q.Var('target_nametag_stats_ref')),
              null
            ),
            target_nametag_likes_received_val: q.If(
              q.Var('has_target_nametag_stats'),
              q.Select(['data', 'likes_received'], q.Var('target_nametag_stats')),
              null
            ),
            target_likes_received: q.If(
              q.IsNull(q.Var('target_nametag_likes_received_val')),
              0,
              q.Var('target_nametag_likes_received_val')
            )
          },
          q.If(
            q.Var('should_continue'),
            q.Do(
              q.Update(q.Var('like_ref'), {
                data: {
                  available: true,
                  post_ref: null,
                  target_nametag_ref: null
                }
              }),
              q.Update(q.Var('post_stats_ref'), {
                data: {
                  likes: q.Subtract(
                    q.Select(['data', 'likes'], q.Var('post_stats')),
                    1
                  )
                }
              }),
              q.Update(q.Var('target_nametag_stats_ref'), {
                data: {
                  likes_received: q.Subtract(q.Var('target_likes_received'), 1)
                }
              }),
              true
            ),
            false
          )
        )
      );
    } catch (e) {
      console.error('[>Like.unlike()]', e);
      return false;
    }
  }

  static async update(id: string, data: Partial<ServerLike>) {
    return await Fauna.update(this.toRef(id), data, this.parseFQL);
  }

  static toRef(id: string) {
    return Fauna.toRef(Like.collection, id);
  }

  static parseFQL(fql: any) {
    return Fauna.parseFQL(fql, [
      'invoice_ref',
      'nametag_ref',
      'post_ref',
      'reply_ref',
      'chat_ref',
      'target_nametag_ref'
    ]);
  }
}
