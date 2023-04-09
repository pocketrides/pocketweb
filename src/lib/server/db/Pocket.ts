import type { NewPocketResponse } from '$lib/api/pocket/new';
import type { DraftPocket, ServerPocket } from '$lib/zod/Pocket';
import type { FaunaPocketCohost } from '$lib/zod/PocketCohost';
import { Fauna, q } from './Fauna';
import { Nametag } from './Nametag';
import { PocketCohost } from './PocketCohost';
import { PocketMember } from './PocketMember';

type GetPocketQueryResponse =
  | {
      success: true;
      pocket: any;
      nametag: any;
      hosts: any[];
      members_count: number[];
    }
  | { success: false };

export class Pocket {
  static collection = 'pockets';

  static fql_for = {
    get_pocket: (ref_var: string = 'pocket_ref') => {
      return q.Let(
        {
          exists: q.Exists(q.Var(ref_var)),
          pocket: q.If(q.Var('exists'), q.Get(q.Var(ref_var)), null),
          nametag: q.If(
            q.Var('exists'),
            q.Get(q.Select(['data', 'nametag_ref'], q.Var('pocket'))),
            null
          ),
          hosts: q.If(q.Var('exists'), PocketCohost.fql_for.list(ref_var), null),
          members_count: q.If(
            q.Var('exists'),
            PocketMember.fql_for.members_count(ref_var),
            null
          )
        },
        q.If(
          q.Var('exists'),
          {
            success: true,
            pocket: q.Var('pocket'),
            nametag: q.Var('nametag'),
            hosts: q.Var('hosts'),
            members_count: q.Var('members_count')
          },
          { success: false }
        )
      );
    }
  };

  static async create(
    nametag_id: string,
    payload: DraftPocket
  ): Promise<NewPocketResponse> {
    try {
      const hosts = payload.hosts;

      let data: any = Object.assign(payload, {
        nametag_ref: Nametag.toRef(nametag_id)
      });

      delete data.hosts;

      return await Fauna.client().query<NewPocketResponse>(
        q.Let(
          {
            pocket: q.Create(this.collection, { data }),
            pocket_ref: q.Select(['ref'], q.Var('pocket'))
          },
          q.Do(
            q.Foreach(
              hosts.map((h) => h.id),
              q.Lambda('nametag_id', PocketCohost.fql_for.create())
            ),
            {
              success: true,
              pocket_id: q.Select(['ref', 'id'], q.Var('pocket'))
            }
          )
        )
      );
    } catch (e) {
      console.error('db/Pocket.create()', e);
      return { success: false };
    }
  }

  static async retrieve(id: string): Promise<ServerPocket | undefined> {
    try {
      const query = await Fauna.client().query<GetPocketQueryResponse>(
        q.Let(
          {
            pocket_ref: this.toRef(id)
          },
          this.fql_for.get_pocket()
        )
      );

      if (
        query.success &&
        query.pocket &&
        query.nametag &&
        query.hosts &&
        query.members_count
      ) {
        return this.parseFQL(
          query.pocket,
          query.nametag,
          query.hosts,
          query.members_count[0]
        );
      }

      return undefined;
    } catch (e) {
      console.error('db/Pocket.retrieve()', e);
      return undefined;
    }
  }

  static async list(
    nametag_id: string,
    include_unlisted: boolean = false
  ): Promise<{
    pockets: ServerPocket[];
    cohosted_pockets: ServerPocket[];
    unlisted_pockets: ServerPocket[];
  }> {
    try {
      const query = await Fauna.client().query<{
        pockets: GetPocketQueryResponse[];
        cohosted_pockets: GetPocketQueryResponse[];
        unlisted_pockets?: GetPocketQueryResponse[];
      }>(
        q.Let(
          {
            pockets: q.Map(
              q.Paginate(
                q.Match(q.Index('pockets_by_nametag_ref_and_visibility'), [
                  Nametag.toRef(nametag_id),
                  'listed'
                ])
              ),
              q.Lambda('pocket_ref', this.fql_for.get_pocket())
            ),
            cohosted_pockets: q.Map(
              q.Paginate(
                q.Match(q.Index('pocket_cohosts_by_nametag_ref'), [
                  Nametag.toRef(nametag_id)
                ])
              ),
              q.Lambda(
                'cohost_ref',
                q.Let(
                  {
                    cohost: q.Get(q.Var('cohost_ref')),
                    pocket_ref: q.Select(['data', 'pocket_ref'], q.Var('cohost'))
                  },
                  this.fql_for.get_pocket()
                )
              )
            ),
            unlisted_pockets: q.If(
              include_unlisted,
              q.Map(
                q.Paginate(
                  q.Match(q.Index('pockets_by_nametag_ref_and_visibility'), [
                    Nametag.toRef(nametag_id),
                    'unlisted'
                  ])
                ),
                q.Lambda('pocket_ref', this.fql_for.get_pocket())
              ),
              { data: [] }
            )
          },
          {
            pockets: q.Select(['data'], q.Var('pockets')),
            cohosted_pockets: q.Select(['data'], q.Var('cohosted_pockets')),
            unlisted_pockets: q.If(
              include_unlisted,
              q.Select(['data'], q.Var('unlisted_pockets')),
              []
            )
          }
        )
      );

      let response = {
        pockets: this.assemblePocket(query.pockets),
        cohosted_pockets: this.assemblePocket(query.cohosted_pockets),
        unlisted_pockets: this.assemblePocket(query.unlisted_pockets || [])
      };

      return response;
    } catch (e) {
      console.error('db/Pocket.list()', nametag_id, include_unlisted, e);
      return {
        pockets: [],
        cohosted_pockets: [],
        unlisted_pockets: []
      };
    }
  }

  static toRef(id: string) {
    return Fauna.toRef(this.collection, id);
  }

  static assemblePocket(fql: GetPocketQueryResponse[]) {
    const only_success: any = fql.filter((p) => p.success === true);
    return only_success.map((p: any) => {
      return this.parseFQL(p.pocket, p.nametag, p.hosts, p.members_count[0]);
    }) as ServerPocket[];
  }

  static parseFQL(
    fql: any,
    nametag: any,
    hosts: FaunaPocketCohost[],
    members_count: number
  ) {
    return Object.assign(Fauna.parseFQL<ServerPocket>(fql, ['nametag_ref']), {
      nametag: Nametag.parseClientFQL(nametag),
      hosts: hosts.map((h) => Nametag.parseClientFQL(h.nametag)),
      members_count
    }) as ServerPocket;
  }
}
