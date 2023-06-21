import type { ApiGenericResponse } from '$lib/api/api';
import type { NametagCollabListResponse } from '$lib/api/nametag/collab/list';
import type { ClientNametagCollab } from '$lib/zod/NametagCollab';
import { Fauna, q } from './Fauna';
import { Nametag } from './Nametag';

export class NametagCollab {
  static collection = 'nametag_collabs';

  static async list(nametag_id: string): Promise<NametagCollabListResponse> {
    let res: NametagCollabListResponse = { success: false };

    try {
      const query = await Fauna.client().query<{
        collabs: { authorized_nametag: any; nametag: any }[];
      }>(
        q.Let(
          {
            collabs: q.Map(
              q.Paginate(
                q.Match(q.Index('collabs_by_nametag_ref'), [
                  Nametag.toRef(nametag_id)
                ])
              ),
              q.Lambda(
                'c_ref',
                q.Let(
                  {
                    collab: q.Get(q.Var('c_ref'))
                  },
                  {
                    nametag: q.Get(
                      q.Select(['data', 'nametag_ref'], q.Var('collab'))
                    ),
                    authorized_nametag: q.Get(
                      q.Select(['data', 'authorized_nametag_ref'], q.Var('collab'))
                    )
                  }
                )
              )
            )
          },
          {
            collabs: q.Select(['data'], q.Var('collabs'))
          }
        )
      );

      res = {
        success: true,
        collabs: query.collabs.map((c) => this.parseFQL(c))
      };
    } catch (e) {
      console.error(`db/NametagCollab.list`, e);
    }

    return res;
  }

  static async remove(
    nametag_id: string,
    authorized_nametag_id: string
  ): Promise<{ success: boolean; removed_account_id?: string | null }> {
    let response = { success: false };
    try {
      const query = await Fauna.client().query<{
        success: boolean;
        removed_account_id?: string | null;
      }>(
        q.Let(
          {
            match: q.Match(
              q.Index('collabs_by_nametag_ref_and_authorized_nametag_ref'),
              [Nametag.toRef(nametag_id), Nametag.toRef(authorized_nametag_id)]
            ),
            exists: q.Exists(q.Var('match')),
            ref: q.If(
              q.Var('exists'),
              q.Select(['ref'], q.Get(q.Var('match'))),
              null
            ),
            deleted: q.If(q.Var('exists'), q.Delete(q.Var('ref')), false),
            removed_account_id: q.If(
              q.Var('exists'),
              q.Select(['data', 'authorized_account_ref', 'id'], q.Var('deleted')),
              null
            )
          },
          {
            success: q.Not(q.Equals(q.Var('deleted'), false)),
            removed_account_id: q.Var('removed_account_id')
          }
        )
      );

      response = query;
    } catch (e) {
      console.error('db/NametagCollab.remove', e);
    }

    return response;
  }

  static async removeAllCollabs(nametag_id: string): Promise<{ success: boolean }> {
    let response = { success: false };
    try {
      await Fauna.client().query(
        q.Map(
          q.Paginate(
            q.Match(q.Index('collabs_by_nametag_ref'), [Nametag.toRef(nametag_id)])
          ),
          q.Lambda('ref', q.Delete(q.Var('ref')))
        )
      );

      response = { success: true };
    } catch (e) {
      console.error('db/NametagCollab.removeAllCollabs', e);
    }

    return response;
  }

  static async add(nametag_id: string, authorized_nametag_id: string) {
    let response: ApiGenericResponse = { success: false };

    try {
      const query = await Fauna.client().query<ApiGenericResponse>(
        q.Let(
          {
            authorized_nametag: q.Get(Nametag.toRef(authorized_nametag_id))
          },
          q.Do(
            q.Create(q.Collection(this.collection), {
              data: {
                nametag_ref: Nametag.toRef(nametag_id),
                authorized_account_ref: q.Select(
                  ['data', 'account_ref'],
                  q.Var('authorized_nametag')
                ),
                authorized_nametag_ref: q.Select(
                  ['ref'],
                  q.Var('authorized_nametag')
                )
              }
            }),
            { success: true }
          )
        )
      );

      response = query;
    } catch (e) {
      console.error('db/NametagCollab.add', e);
    }

    return response;
  }

  static parseFQL(fql: {
    authorized_nametag: any;
    nametag: any;
  }): ClientNametagCollab {
    return {
      authorized_nametag: Nametag.parseClientFQL(fql.authorized_nametag),
      nametag: Nametag.parseClientFQL(fql.nametag)
    };
  }

  static toRef(id: string) {
    return Fauna.toRef(NametagCollab.collection, id);
  }
}
