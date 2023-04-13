import type { ClientRef } from '$lib/zod/Fauna';
import type { FeedResponse } from '$lib/zod/Feed';
import type { ServerPayout } from '$lib/zod/Payout';
import type { ClientReply } from '$lib/zod/Reply';
import { Fauna, q } from './Fauna';
import { Nametag } from './Nametag';
import { Payout } from './Payout';
import { Pocket } from './Pocket';
import { Post } from './Post';
import { Reply } from './Reply';

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
              q.Join(
                q.Match(q.Index('feed_my_pockets'), [
                  Nametag.toRef(nametag_id),
                  true
                ]),
                q.Index('feed_posts_by_pocket_ref')
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
      console.error('feed/getHomeFeed', e);
      return { post_ids: [], has_more: false };
    }
  }

  static async getPocketFeed(
    pocket_id: string,
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
            q.Match(q.Index('pocket_posts'), [Pocket.toRef(pocket_id)]),
            paginate_opts
          ),
          q.Lambda('x', q.Select(['id'], q.Var('x')))
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
      console.error('feed/getPocketFeed', e);
      return { post_ids: [] };
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
            q.Match(q.Index('posts_by_nametag_and_audience_ts_reversed'), [
              Nametag.toRef(nametag_id),
              'friends'
            ]),
            paginate_opts
          ),
          q.Lambda('x', q.Select(['id'], q.Var('x')))
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
      console.error('feed/getNametagFeed', e);
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
      console.error('feed/getPayoutFeed', e);
      return { post_ids: [] };
    }
  }

  static async getPostRepliesFeed(
    post_id: string,
    after_id?: string
  ): Promise<FeedResponse<ClientReply>> {
    try {
      let paginate_opts: any = { size: 20 };

      if (after_id) {
        paginate_opts.after = [Reply.toRef(after_id)];
      }

      const res = await Fauna.client().query<FaunaQueryResponse<any>>(
        q.Map(
          q.Paginate(q.Match(q.Index('replies_by_post_ref'), [Post.toRef(post_id)])),
          q.Lambda(
            'reply_ref',
            q.Let(
              {
                reply: q.Get(q.Var('reply_ref')),
                nametag: q.Get(q.Select(['data', 'nametag_ref'], q.Var('reply')))
              },
              Reply.fql_for.client_reply()
            )
          )
        )
      );

      if (res.data) {
        let replies: ClientReply[] = res.data.map((r) => {
          return Reply.parseFQL(r);
        });

        if (replies[0].id === after_id) replies.shift();
        if (replies[replies.length - 1].id === after_id) replies.pop();

        return {
          post_ids: replies,
          after_id: res.after && res.after[0] ? res.after[0].id : undefined,
          has_more: res.after && res.after[0] ? true : false
        };
      } else {
        return {
          post_ids: [],
          has_more: false
        };
      }
    } catch (e) {
      console.error('feed/getPostRepliesFeed', e);
      return { post_ids: [] };
    }
  }
}
