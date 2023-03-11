import type { ClientRef } from '$lib/zod/Fauna';
import type { FeedResponse } from '$lib/zod/Feed';
import type { ServerPayout } from '$lib/zod/Payout';
import { Fauna, q } from './Fauna';
import { Nametag } from './Nametag';
import { NametagStats } from './NametagStats';
import { Payout } from './Payout';
import { Post } from './Post';

type FaunaQueryResponse<T = string> = {
  data: T[];
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
              q.Join(
                q.Match(q.Index('feed_close_friends'), [Nametag.toRef(nametag_id)]),
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

  static async getPayoutFeed(
    nametag_id: string,
    after_id?: string
  ): Promise<FeedResponse<ServerPayout>> {
    try {
      let paginate_opts: any = { size: 20 };

      if (after_id) {
        paginate_opts.after = [Payout.toRef(after_id)];
      }

      const res = await Fauna.client().query<FaunaQueryResponse<any>>(
        q.Map(
          q.Paginate(
            q.Match(q.Index('payouts_by_nametag_ref_reversed'), [
              Nametag.toRef(nametag_id)
            ]),
            paginate_opts
          ),
          q.Lambda('x', q.Get(q.Var('x')))
        )
      );

      if (res && res.data) {
        let payouts: ServerPayout[] = res.data.map((p) => {
          return Payout.parseFQL(p);
        });

        if (payouts[0].id === after_id) payouts.shift();
        if (payouts[payouts.length - 1].id === after_id) payouts.pop();

        return {
          post_ids: payouts,
          after_id: res.after && res.after[0] ? res.after[0].id : undefined,
          has_more: res.after && res.after[0] ? true : false
        };
      } else return { post_ids: [], has_more: false };
    } catch (e) {
      return { post_ids: [] };
    }
  }
}
