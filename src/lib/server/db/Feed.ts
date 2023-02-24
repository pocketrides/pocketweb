import { Fauna, q } from './Fauna';
import { Nametag } from './Nametag';
import { NametagStats } from './NametagStats';
import { Post } from './Post';

export class Feed {
  static async getHomeFeed(nametag_id: string): Promise<string[]> {
    const stats = await NametagStats.getByNametagRef(nametag_id);

    let paginate_opts: any = { size: 10 };

    if (stats && stats.last_seen && stats.last_seen.home) {
      // stats.last_seen.home will be the last post ID they saw
      paginate_opts.after = Post.toRef(stats.last_seen.home);
    }

    try {
      const res = await Fauna.client().query<{ data: string[] }>(
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

      if (res && res.data) return res.data;
      else return [];
    } catch (e) {
      return [];
    }
  }
}
