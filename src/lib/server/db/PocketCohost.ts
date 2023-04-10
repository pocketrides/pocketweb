import type { ClientPocketCohost, FaunaPocketCohost } from '$lib/zod/PocketCohost';
import { Fauna, q } from './Fauna';
import { Nametag } from './Nametag';
import { Pocket } from './Pocket';

export class PocketCohost {
  static collection = 'pocket_cohosts';

  static fql_for = {
    create: (
      nametag_id_var: string = 'nametag_id',
      pocket_ref_var: string = 'pocket_ref'
    ) => {
      return q.Create(this.collection, {
        data: {
          nametag_ref: q.Ref(
            q.Collection(Nametag.collection),
            q.Var(nametag_id_var)
          ),
          pocket_ref: q.Var(pocket_ref_var)
        } as FaunaPocketCohost
      });
    },
    list: (pocket_ref_var: string = 'pocket_ref') => {
      return q.Select(
        ['data'],
        q.Map(
          q.Paginate(
            q.Match(q.Index('pocket_cohosts_by_pocket_ref'), [q.Var(pocket_ref_var)])
          ),
          q.Lambda(
            'cohost_ref',
            q.Let(
              {
                cohost: q.Get(q.Var('cohost_ref')),
                nametag_ref: q.Select(['data', 'nametag_ref'], q.Var('cohost')),
                nametag: q.Get(q.Var('nametag_ref'))
              },
              {
                pocket_ref: q.Var(pocket_ref_var),
                nametag_ref: q.Var('nametag_ref'),
                nametag: q.Var('nametag')
              }
            )
          )
        )
      );
    },
    delete_all: (pocket_id: string) => {
      return q.Map(
        q.Paginate(
          q.Match(q.Index('pocket_cohosts_by_pocket_ref'), [Pocket.toRef(pocket_id)])
        ),
        q.Lambda('cohost_ref', q.Delete(q.Var('cohost_ref')))
      );
    }
  };

  static async create() {}

  static toRef(id: string) {
    return Fauna.toRef(this.collection, id);
  }

  static parseFQL(fql: any): ClientPocketCohost {
    return Object.assign(
      Fauna.parseFQL<ClientPocketCohost>(fql, ['pocket_ref', 'nametag_ref']),
      { nametag: Nametag.parseClientFQL(fql.nametag) }
    ) as ClientPocketCohost;
  }
}
