import { Pocket } from '$lib/server/db/Pocket';
import { TopicSubscribe } from '$lib/server/Notify';
import type { ClientRef } from '$lib/zod/Fauna';
import {
  draft_post_validator,
  type DraftPost,
  type ServerPost
} from '$lib/zod/Post';
import { Fauna, q } from './Fauna';
import { Nametag } from './Nametag';
import { NametagStats } from './NametagStats';
import { PostStats } from './PostStats';

export class Post {
  static collection = 'posts';

  static async retrieve(
    post_id: string,
    nametag_id: string | null
  ): Promise<{ success: boolean; post?: ServerPost }> {
    try {
      const req = await Fauna.client().query<{
        success: boolean;
        post: any;
        post_nametag: any;
        post_stats: any;
        is_liked?: boolean;
        unlike_key?: string;
        is_quarantined?: boolean;
        pocket_name?: string;
      }>(q.Call('retrieve_post', [post_id, nametag_id]));

      if (req.success) {
        let post = Post.parseFQL(req.post);

        post.nametag = Nametag.parseClientFQL(req.post_nametag);
        post.stats = PostStats.parseFQL(req.post_stats);

        post.is_liked = req.is_liked;
        post.unlike_key = req.unlike_key;
        post.is_quarantined = req.is_quarantined;

        post.pocket_name =
          typeof req.pocket_name === 'string'
            ? req.pocket_name.replace(/\n/g, ' ')
            : undefined;

        return { success: true, post };
      } else
        throw new Error('unsuccessful in retrieving a post', {
          cause: {
            post_id,
            nametag_id,
            req
          }
        });
    } catch (e) {
      console.error('post/retrieve', e);
      return { success: false };
    }
  }

  static async retrieveToEdit(
    post_id: string,
    nametag_id: string
  ): Promise<DraftPost | undefined> {
    const post = await this.get(post_id);

    if (post) {
      if ((post.nametag_ref as ClientRef).id === nametag_id) {
        const p = draft_post_validator.safeParse(post);

        if (p.success) {
          return p.data;
        }
      }
    }

    return undefined;
  }

  static async get(post_id: string) {
    const post = await Fauna.get<ServerPost>(Post.toRef(post_id), Post.parseFQL);

    return post;
  }

  static async getById(post_id: string) {
    const post = await Fauna.get<ServerPost>(Post.toRef(post_id), Post.parseFQL);

    if (post) {
      const stats = await PostStats.getByPostId(post.id);

      if (stats) {
        post.stats = stats;
      }

      const nametag = await Nametag.getById((post.nametag_ref as ClientRef).id);

      if (nametag) {
        post.nametag = nametag;
      }
    }

    return post;
  }

  static async create(nametag_id: string, draft: DraftPost) {
    let data: any = Object.assign(draft, {
      nametag_ref: Nametag.toRef(nametag_id),
      pocket_ref: draft.pocket_id ? Pocket.toRef(draft.pocket_id) : undefined
    });

    delete data.pocket_id;

    let post = await Fauna.create<ServerPost>(Post.collection, data, Post.parseFQL);

    if (post) {
      const stats = await PostStats.create(post.id, data.settings.is_nsfw);

      if (stats) {
        post = await Fauna.update<ServerPost>(
          Post.toRef(post.id),
          {
            stats_ref: PostStats.toRef(stats.id)
          },
          Post.parseFQL
        );
      }

      await NametagStats.addPost(nametag_id);
    }

    if (post) {
      await TopicSubscribe(nametag_id, post.id);
    }

    return post;
  }

  static async update(
    post_id: string,
    nametag_id: string,
    data: Partial<DraftPost>
  ): Promise<boolean> {
    try {
      const query = await Fauna.client().query<boolean>(
        q.Let(
          {
            post: q.Get(Post.toRef(post_id))
          },
          q.If(
            q.Equals(
              q.Select(['data', 'nametag_ref'], q.Var('post')),
              Nametag.toRef(nametag_id)
            ),
            q.Do(
              q.Update(Post.toRef(post_id), {
                data
              }),
              true
            ),
            false
          )
        )
      );

      return query;
    } catch (e) {
      console.error('db/Post.update()', e);
      return false;
    }
  }

  static async delete(post_id: string, nametag_id: string): Promise<boolean> {
    try {
      return await Fauna.client().query<boolean>(
        q.Let(
          {
            post_ref: Post.toRef(post_id),
            post: q.Get(q.Var('post_ref')),
            stats_ref: q.Select(['data', 'stats_ref'], q.Var('post')),
            nametag_ref: q.Select(['data', 'nametag_ref'], q.Var('post'))
          },
          q.If(
            q.Equals(q.Var('nametag_ref'), Nametag.toRef(nametag_id)),
            q.Do(
              q.Delete(q.Var('post_ref')),
              q.Delete(q.Var('stats_ref')),
              q.Let(
                {
                  nametag_stats: NametagStats.fql_for.get_by_nametag_ref()
                },
                q.Do(
                  q.Update(q.Select(['ref'], q.Var('nametag_stats')), {
                    data: {
                      posts: q.Subtract(
                        q.Select(['data', 'posts'], q.Var('nametag_stats')),
                        1
                      )
                    }
                  }),
                  true
                )
              )
            ),
            false
          )
        )
      );
    } catch (e) {
      console.error('db/Post.delete()', post_id, nametag_id, e);
      return false;
    }
  }

  static async deleteAll(nametag_id: string) {
    try {
      await Fauna.client().query(
        q.Map(
          q.Paginate(
            q.Match(q.Index('posts_by_nametag_ref'), [Nametag.toRef(nametag_id)]),
            { size: 2500 }
          ),
          q.Lambda(
            ['post_ref', 'stats_ref'],
            q.Do(q.Delete(q.Var('post_ref')), q.Delete(q.Var('stats_ref')))
          )
        )
      );
      return true;
    } catch (e) {
      console.warn('post/deleteAll', e);
      return false;
    }
  }

  static toRef(post_id: string) {
    return Fauna.toRef(Post.collection, post_id);
  }

  static parseFQL(fql: any) {
    return Fauna.parseFQL<ServerPost>(fql, [
      'nametag_ref',
      'stats_ref',
      'pocket_ref'
    ]);
  }
}
