import type { DraftNametagStats, ServerNametagStats } from '$lib/zod/NametagStats';
import { Fauna, q } from './Fauna';
import { Nametag } from './Nametag';

export class NametagStats {
  static collection = 'nametag_stats';

  static fql_for = {
    get_by_nametag_ref: (nametag_ref_var = 'nametag_ref') => {
      return q.Get(
        q.Match(q.Index('nametag_stats_by_nametag_ref'), [q.Var(nametag_ref_var)])
      );
    }
  };

  static async get(stats_id: string) {
    return await Fauna.get<ServerNametagStats>(this.toRef(stats_id), this.parseFQL);
  }

  static async getByNametagRef(nametag_id: string) {
    return await Fauna.one<ServerNametagStats>(
      'nametag_stats_by_nametag_ref',
      Nametag.toRef(nametag_id),
      NametagStats.parseFQL
    );
  }

  static async isPrivate(nametag_id: string): Promise<boolean> {
    const stats = await NametagStats.getByNametagRef(nametag_id);
    return stats?.private === true;
  }

  static async create(nametag_id: string, draft: DraftNametagStats) {
    const exists = await NametagStats.getByNametagRef(nametag_id);

    if (exists === undefined) {
      const data = Object.assign(draft, {
        nametag_ref: Nametag.toRef(nametag_id)
      });

      return await Fauna.create<ServerNametagStats>(
        NametagStats.collection,
        data,
        NametagStats.parseFQL
      );
    } else return exists;
  }

  static async addFollower(nametag_id: string) {
    const stats = await NametagStats.getByNametagRef(nametag_id);

    if (stats) {
      await NametagStats.update(stats.id, { followers: stats.followers + 1 });
    }
  }

  static async subtractFollower(nametag_id: string) {
    const stats = await NametagStats.getByNametagRef(nametag_id);

    if (stats) {
      await NametagStats.update(stats.id, { followers: stats.followers - 1 });
    }
  }

  static async addFriend(nametag_id: string) {
    const stats = await NametagStats.getByNametagRef(nametag_id);

    if (stats) {
      await NametagStats.update(stats.id, { friends: stats.friends + 1 });
    }
  }

  static async subtractFriend(nametag_id: string) {
    const stats = await NametagStats.getByNametagRef(nametag_id);

    if (stats) {
      await NametagStats.update(stats.id, { friends: stats.friends - 1 });
    }
  }

  static async addPost(nametag_id: string) {
    const stats = await NametagStats.getByNametagRef(nametag_id);

    if (stats) {
      await NametagStats.update(stats.id, { posts: stats.posts + 1 });
    }
  }

  static async subtractPost(nametag_id: string) {
    const stats = await NametagStats.getByNametagRef(nametag_id);

    if (stats) {
      await NametagStats.update(stats.id, { posts: stats.posts - 1 });
    }
  }

  static async update(id: string, data: Partial<ServerNametagStats>) {
    return await Fauna.update(NametagStats.toRef(id), data, NametagStats.parseFQL);
  }

  static async delete(id: string) {
    return await Fauna.delete(this.toRef(id));
  }

  static parseFQL(fql: any) {
    return Fauna.parseFQL(fql, ['nametag_ref']);
  }

  static toRef(id: string) {
    return Fauna.toRef(NametagStats.collection, id);
  }
}
