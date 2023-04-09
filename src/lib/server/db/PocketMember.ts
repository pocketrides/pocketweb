import type { ClientPocketMember } from '$lib/zod/PocketMember';
import { Fauna, q } from './Fauna';
import { Nametag } from './Nametag';
import { Pocket } from './Pocket';

export class PocketMember {
  static collection = 'pocket_members';

  static fql_for = {
    members_count: (ref_var: string = 'pocket_ref') => {
      return q.Select(
        ['data'],
        q.Count(
          q.Paginate(
            q.Match(q.Index('pocket_members_by_pocket_ref'), [
              q.Select(['id'], q.Var(ref_var))
            ]),
            { size: 500 }
          )
        )
      );
    }
  };

  static async getMember(
    pocket_id: string,
    nametag_id: string
  ): Promise<ClientPocketMember | undefined> {
    try {
      const query = await Fauna.client().query<{ member: any; nametag: any } | null>(
        q.Let(
          {
            match: q.Match(q.Index('pocket_members_by_pocket_ref_and_nametag_ref'), [
              Pocket.toRef(pocket_id),
              Nametag.toRef(nametag_id)
            ]),
            exists: q.Exists(q.Var('match')),
            member: q.If(q.Var('exists'), q.Get(q.Var('match')), null)
          },
          q.If(
            q.Var('exists'),
            {
              member: q.Var('member'),
              nametag: q.Get(q.Select(['data', 'nametag_ref'], q.Var('member')))
            },
            null
          )
        )
      );

      if (query) {
        return this.parseFQL(query.member, query.nametag);
      }

      return undefined;
    } catch (e) {
      console.error('db/PocketMember.getMember()', e);
      return undefined;
    }
  }

  static async createMember(
    pocket_id: string,
    nametag_id: string
  ): Promise<boolean> {
    try {
      return await Fauna.client().query<boolean>(
        q.Let(
          {
            pocket_ref: Pocket.toRef(pocket_id),
            exists: q.Exists(q.Var('pocket_ref')),
            member_exists: q.Exists(
              q.Match(q.Index('pocket_members_by_pocket_ref_and_nametag_ref'), [
                Pocket.toRef(pocket_id),
                Nametag.toRef(nametag_id)
              ])
            )
          },
          q.If(
            q.Or(
              q.Equals(q.Var('exists'), false),
              q.Equals(q.Var('member_exists'), true)
            ),
            false,
            q.Let(
              {
                pocket: q.Get(q.Var('pocket_ref')),
                joinability: q.Select(
                  ['data', 'settings', 'joinability'],
                  q.Var('pocket')
                ),
                member: q.Create(q.Collection(this.collection), {
                  data: {
                    pocket_ref: q.Var('pocket_ref'),
                    nametag_ref: Nametag.toRef(nametag_id),
                    status: q.If(
                      q.Equals(q.Var('joinability'), 'moderated'),
                      'pending',
                      'joined'
                    ),
                    settings: {
                      enable_notifications: true
                    }
                  }
                })
              },
              true
            )
          )
        )
      );
    } catch (e) {
      console.error('db/PocketMember.createMember()', e);
      return false;
    }
  }

  static async removeMember(
    pocket_id: string,
    nametag_id: string
  ): Promise<boolean> {
    try {
      return await Fauna.client().query<boolean>(
        q.Do(
          q.Map(
            q.Paginate(
              q.Match(q.Index('pocket_members_by_pocket_ref_and_nametag_ref'), [
                Pocket.toRef(pocket_id),
                Nametag.toRef(nametag_id)
              ])
            ),
            q.Lambda('member_ref', q.Delete(q.Var('member_ref')))
          ),
          true
        )
      );
    } catch (e) {
      return false;
    }
  }

  static parseFQL(fql: any, nametag: any) {
    return Object.assign(
      Fauna.parseFQL<ClientPocketMember>(fql, ['pocket_ref', 'nametag_ref']),
      {
        nametag: Nametag.parseClientFQL(nametag)
      }
    ) as ClientPocketMember;
  }

  static toRef(id: string) {
    return Fauna.toRef(this.collection, id);
  }
}
