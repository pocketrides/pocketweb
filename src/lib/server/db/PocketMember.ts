import type { PocketMemberListResponse } from '$lib/api/pocket/members/list';
import type { ClientPocketMember, PocketMemberStatus } from '$lib/zod/PocketMember';
import { Fauna, q } from './Fauna';
import { Nametag } from './Nametag';
import { Pocket } from './Pocket';

export type QueryClientPocketMemberReturnType = {
  member: any;
  nametag: any;
};

export class PocketMember {
  static collection = 'pocket_members';

  static fql_for = {
    client_pocket_member: (member_var: string = 'member') => {
      return {
        member: q.Var(member_var),
        nametag: q.Get(q.Select(['data', 'nametag_ref'], q.Var(member_var)))
      };
    },
    members_count: (ref_var: string = 'pocket_ref') => {
      return q.Select(
        ['data'],
        q.Count(
          q.Paginate(
            q.Match(q.Index('pocket_members_by_pocket_ref'), [q.Var(ref_var)]),
            { size: 500 }
          )
        )
      );
    },

    joined_pockets: (nametag_id: string) => {
      return q.Map(
        q.Paginate(
          q.Match(q.Index('pocket_members_by_nametag_ref'), [
            Nametag.toRef(nametag_id)
          ])
        ),
        q.Lambda(
          'member_ref',
          q.Let(
            {
              member: q.Get(q.Var('member_ref')),
              pocket_ref: q.Select(['data', 'pocket_ref'], q.Var('member'))
            },
            Pocket.fql_for.get_pocket()
          )
        )
      );
    },

    delete_all: (pocket_id: string) => {
      return q.Map(
        q.Paginate(
          q.Match(q.Index('pocket_members_by_pocket_ref'), [
            Pocket.toRef(pocket_id)
          ]),
          { size: 2500 }
        ),
        q.Lambda('member_ref', q.Delete(q.Var('member_ref')))
      );
    }
  };

  static async canFreeNametagJoin(nametag_id: string): Promise<boolean> {
    try {
      const query = await Fauna.client().query<{ data: number[] }>(
        q.Count(
          q.Paginate(
            q.Match(q.Index('pocket_members_by_nametag_ref'), [
              Nametag.toRef(nametag_id)
            ]),
            { size: 10 }
          )
        )
      );

      if (query.data[0] >= 3) return false;
      return true;
    } catch (e) {
      console.error('db/PocketMember.canFreeNametagJoin()', e);
      return false;
    }
  }

  static async getMember(
    pocket_id: string,
    nametag_id: string
  ): Promise<ClientPocketMember | undefined> {
    try {
      const query =
        await Fauna.client().query<QueryClientPocketMemberReturnType | null>(
          q.Let(
            {
              match: q.Match(
                q.Index('pocket_members_by_pocket_ref_and_nametag_ref'),
                [Pocket.toRef(pocket_id), Nametag.toRef(nametag_id)]
              ),
              exists: q.Exists(q.Var('match')),
              member: q.If(q.Var('exists'), q.Get(q.Var('match')), null)
            },
            q.If(q.Var('exists'), this.fql_for.client_pocket_member(), null)
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

  static async list(pocket_id: string): Promise<PocketMemberListResponse> {
    try {
      const query = await Fauna.client().query<{
        data: QueryClientPocketMemberReturnType[];
      }>(
        q.Map(
          q.Paginate(
            q.Match(q.Index('pocket_members_by_pocket_ref'), [
              Pocket.toRef(pocket_id)
            ])
          ),
          q.Lambda(
            'member_ref',
            q.Let(
              {
                member: q.Get(q.Var('member_ref'))
              },
              this.fql_for.client_pocket_member()
            )
          )
        )
      );

      return {
        success: true,
        members: query.data.map((v) => this.parseFQL(v.member, v.nametag))
      };
    } catch (e) {
      console.error('db/PocketMember.list()', e);
      return { success: false, members: [] };
    }
  }

  static async updateStatus(
    member_id: string,
    new_status: PocketMemberStatus | 'deleted'
  ): Promise<ClientPocketMember | undefined> {
    try {
      if (new_status === 'deleted') {
        await Fauna.client().query(q.Delete(this.toRef(member_id)));
        return undefined;
      } else {
        const query = await Fauna.client().query<QueryClientPocketMemberReturnType>(
          q.Let(
            {
              member_ref: this.toRef(member_id),
              member: q.Update(q.Var('member_ref'), { data: { status: new_status } })
            },
            this.fql_for.client_pocket_member()
          )
        );

        return this.parseFQL(query.member, query.nametag);
      }
    } catch (e) {
      console.error('db/PocketMember.updateStatus()', e);
      return undefined;
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
