import type { NewPocketResponse } from '$lib/api/pocket/new';
import type { DraftPocket } from '$lib/zod/Pocket';
import { Fauna, q } from './Fauna';
import { Nametag } from './Nametag';

export class Pocket {
  static collection = 'pockets';

  static fql_for = {
    get_pocket: (variable_name: string = 'pocket') => {
      return {};
    }
  };

  static async create(
    nametag_id: string,
    payload: DraftPocket
  ): Promise<NewPocketResponse> {
    try {
      const data = Object.assign(payload, {
        nametag_ref: Nametag.toRef(nametag_id),
        hosts: payload.hosts.map((host) => {
          return Nametag.toRef(host.id);
        })
      });

      return await Fauna.client().query<NewPocketResponse>(
        q.Let(
          {
            pocket: q.Create(this.collection, { data })
          },
          {
            success: true,
            pocket_id: q.Select(['ref', 'id'], q.Var('pocket'))
          }
        )
      );
    } catch (e) {
      console.error('db/Pocket.create()', e);
      return { success: false };
    }
  }

  static toRef(id: string) {
    return Fauna.toRef(this.collection, id);
  }
}
