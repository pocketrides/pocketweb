import type { ClientRef } from '$lib/zod/Fauna';
import type { FeedResponse } from '$lib/zod/Feed';
import { Fauna, q } from './Fauna';
import { Nametag } from './Nametag';
import { NametagStats } from './NametagStats';
import { Post } from './Post';

type FaunaQueryResponse = {
  data: string[];
  before?: ClientRef[];
  after?: ClientRef[];
};

export class Feed {
  // returns a list of post IDs for the nametag_id
  static async getHomeFeed(
    nametag_id: string,
    after_id?: string
  ): Promise<FeedResponse> {
    let paginate_opts: any = { size: 60 };

    if (after_id) {
      paginate_opts.after = [Post.toRef(after_id)];
    } else {
      paginate_opts.before = null; // get the last page of results
    }

    try {
      const res = await Fauna.client().query<FaunaQueryResponse>(
        q.Map(
          q.Paginate(
            q.Union(
              q.Join(
                q.Match(q.Index('feed_friends'), [Nametag.toRef(nametag_id)]),
                q.Index('feed_posts')
              ),
              q.Match(q.Index('feed_posts'), [Nametag.toRef(nametag_id)])
            ),
            paginate_opts
          ),
          q.Lambda('x', q.Select([0, 'id'], q.Var('x')))
        )
      );

      if (res && res.data) {
        if (res.data[0] === after_id) res.data.shift();

        return {
          post_ids: res.data,
          after_id: res.after && res.after[0] ? res.after[0].id : undefined,
          has_more: res.after && res.after[0] ? true : false
        };
      } else return { post_ids: [], has_more: false };
    } catch (e) {
      return { post_ids: [], has_more: false };
    }
  }

  static async getNametagFeed(
    nametag_id: string,
    after_id?: string
  ): Promise<FeedResponse> {
    try {
      let paginate_opts: any = { size: 20 };

      if (after_id) {
        paginate_opts.after = [Post.toRef(after_id)];
      }

      const res = await Fauna.client().query<FaunaQueryResponse>(
        q.Map(
          q.Paginate(
            q.Match(q.Index('feed_posts_ts_reverse'), [Nametag.toRef(nametag_id)]),
            paginate_opts
          ),
          q.Lambda('x', q.Select([0, 'id'], q.Var('x')))
        )
      );

      if (res && res.data) {
        if (res.data[0] === after_id) res.data.shift();

        return {
          post_ids: res.data,
          after_id: res.after && res.after[0] ? res.after[0].id : undefined,
          has_more: res.after && res.after[0] ? true : false
        };
      } else return { post_ids: [], has_more: false };
    } catch (e) {
      return { post_ids: [] };
    }
  }
}
