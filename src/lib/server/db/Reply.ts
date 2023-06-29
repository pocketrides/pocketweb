import { Post } from './Post';
import type {
  ReplyToPostPayload,
  ReplyToPostResponse
} from '$lib/api/reply/reply_to_post';
import { Fauna, q } from './Fauna';
import { Nametag } from './Nametag';
import { blankReplyStats, type ClientReply } from '$lib/zod/Reply';
import * as Sentry from '@sentry/svelte';

export class Reply {
  static collection = 'replies';

  static fql_for = {
    client_reply: (var_name: string = 'reply') => {
      return {
        id: q.Select(['ref', 'id'], q.Var(var_name)),
        ts: q.Select(['ts'], q.Var(var_name)),
        messages: q.Select(['data', 'messages'], q.Var(var_name)),
        stats: q.Select(['data', 'stats'], q.Var(var_name)),
        nametag: Nametag.fql_for.client_nametag()
      };
    }
  };

  static async replyToPost(
    nametag_id: string,
    payload: ReplyToPostPayload
  ): Promise<ReplyToPostResponse> {
    try {
      return await Fauna.client().query<ReplyToPostResponse>(
        q.Let(
          {
            post_ref: Post.toRef(payload.post_id),
            post_exists: q.Exists(q.Var('post_ref')),
            post: q.If(q.Var('post_exists'), q.Get(q.Var('post_ref')), null),
            has_post: q.If(q.IsNull(q.Var('post')), false, true),
            post_stats: q.If(
              q.Var('has_post'),
              q.Get(q.Select(['data', 'stats_ref'], q.Var('post'))),
              null
            ),
            enable_replies: q.If(
              q.Var('has_post'),
              q.Select(['data', 'settings', 'enable_replies'], q.Var('post')),
              false
            ),
            can_reply: q.Var('enable_replies')
          },
          q.If(
            q.Var('can_reply'),
            q.Let(
              {
                nametag_ref: Nametag.toRef(nametag_id),
                nametag: q.Get(q.Var('nametag_ref')),
                reply: q.Create(q.Collection(this.collection), {
                  data: {
                    nametag_ref: q.Var('nametag_ref'),
                    post_ref: q.Var('post_ref'),
                    messages: payload.messages,
                    stats: blankReplyStats()
                  }
                }),
                stats_updated: q.Update(
                  q.Select(['data', 'stats_ref'], q.Var('post')),
                  {
                    data: {
                      replies: q.Add(
                        q.Select(['data', 'replies'], q.Var('post_stats')),
                        1
                      )
                    }
                  }
                )
              },
              {
                success: true,
                reply: this.fql_for.client_reply(),
                new_count: q.Select(['data', 'replies'], q.Var('stats_updated'))
              }
            ),
            { success: false }
          )
        )
      );
    } catch (e) {
      Sentry.captureException(e);
      return { success: false };
    }
  }

  static async retrieve(
    post_id: string,
    nametag_id?: string | null
  ): Promise<ClientReply[]> {
    try {
      const query = await Fauna.client().query<{ data: ClientReply[] }>(
        q.Let(
          {
            post_ref: Post.toRef(post_id),
            post_exists: q.Exists(q.Var('post_ref')),
            post: q.If(q.Var('post_exists'), q.Get(q.Var('post_ref')), null),
            has_post: q.If(q.IsNull(q.Var('post')), false, true),
            post_audience: q.If(
              q.Var('has_post'),
              q.Select(['data', 'audience'], q.Var('post')),
              ''
            ),
            is_close_friends_audience: q.Equals(
              q.Var('post_audience'),
              'close_friends'
            ),
            is_close_friend: q.If(
              q.Var('is_close_friends_audience'),
              q.Or(
                q.Exists(
                  q.Match(q.Index('is_close_friend'), [
                    q.Select(['data', 'nametag_ref'], q.Var('post')),
                    nametag_id ? Nametag.toRef(nametag_id) : null
                  ])
                ),
                q.Equals(
                  q.Select(['data', 'nametag_ref'], q.Var('post')),
                  nametag_id ? Nametag.toRef(nametag_id) : null
                )
              ),
              false
            ),
            can_continue: q.And(
              q.Var('post_exists'),
              q.If(
                q.Var('is_close_friends_audience'),
                q.Var('is_close_friend'),
                true
              )
            )
          },
          q.If(
            q.Var('can_continue'),
            q.Map(
              q.Paginate(
                q.Match(q.Index('replies_by_post_ref'), [Post.toRef(post_id)]),
                {
                  before: null
                }
              ),
              q.Lambda(
                'r',
                q.Let(
                  {
                    reply: q.Get(q.Var('r')),
                    nametag: q.Get(q.Select(['data', 'nametag_ref'], q.Var('reply')))
                  },
                  this.fql_for.client_reply()
                )
              )
            ),
            { data: [] }
          )
        )
      );

      return query.data;
    } catch (e) {
      Sentry.captureException(e);
      console.error(`db/Reply.retrieve`, e);
      return [];
    }
  }

  static toRef(reply_id: string) {
    return Fauna.toRef(this.collection, reply_id);
  }

  static parseFQL(fql: any) {
    let reply = Fauna.parseFQL<ClientReply>(fql, ['nametag_ref', 'post_ref']);
    if (fql.nametag) reply.nametag = Nametag.parseClientFQL(fql.nametag);
    return reply;
  }
}
