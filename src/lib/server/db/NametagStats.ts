import type { DraftNametagStats, ServerNametagStats } from '$lib/zod/NametagStats';
import { Fauna } from './Fauna';
import { Nametag } from './Nametag';

export class NametagStats {
  static collection = 'nametag_stats';

  static async getByNametagRef(nametag_id: string) {
    return await Fauna.one<ServerNametagStats>(
      'nametag_stats_by_nametag_ref',
      Nametag.toRef(nametag_id),
      NametagStats.parseFQL
    );
  }

  static async create(nametag_id: string, draft: DraftNametagStats) {
    const data = Object.assign(draft, {
      nametag_ref: Nametag.toRef(nametag_id)
    });

    return await Fauna.create<ServerNametagStats>(
      NametagStats.collection,
      data,
      NametagStats.parseFQL
    );
  }

  static async update(id: string, data: Partial<DraftNametagStats>) {
    return await Fauna.update(NametagStats.toRef(id), data, NametagStats.parseFQL);
  }

  static parseFQL(fql: any) {
    return Fauna.parseFQL(fql, ['nametag_ref']);
  }

  static toRef(id: string) {
    return Fauna.toRef(NametagStats.collection, id);
  }
}
