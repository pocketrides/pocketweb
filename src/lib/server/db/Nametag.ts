import { NametagCollab } from '$lib/server/db/NametagCollab';
import { Fauna, q } from './Fauna';
import { Account } from './Account';
import type { ClientNametag, DraftNametag, ServerNametag } from '$lib/zod/Nametag';
import { NametagStats } from './NametagStats';
import { blankNametagStats } from '$lib/zod/NametagStats';
import { blankAccountStatus } from '$lib/zod/Stripe';
import type { NametagRelationshipsGetFriendsRequest } from '$lib/api/nametag/relationships';
import type { ClientNametagCollab } from '$lib/zod/NametagCollab';

export class Nametag {
  static collection = 'nametags';

  static fql_for = {
    client_nametag: (var_name: string = 'nametag') => {
      return {
        id: q.Select(['ref', 'id'], q.Var(var_name)),
        nametag: q.Select(['data', 'nametag'], q.Var(var_name)),
        theme: q.Select(['data', 'theme'], q.Var(var_name)),
        profile_pic: q.Select(['data', 'profile_pic'], q.Var(var_name))
      };
    }
  };

  static async verifyOwnership(
    account_id: string,
    nametag_id: string
  ): Promise<ServerNametag | undefined> {
    try {
      const query = await Fauna.client().query<ServerNametag | null>(
        q.Let(
          {
            direct: q.Match(q.Index('verify_nametag_ownership'), [
              Account.toRef(account_id),
              nametag_id
            ]),
            direct_exists: q.Exists(q.Var('direct'))
          },
          q.If(
            q.Var('direct_exists'),
            q.Get(q.Var('direct')),
            q.Let(
              {
                collab: q.Match(
                  q.Index('collabs_by_authorized_account_ref_and_nametag_ref'),
                  [Account.toRef(account_id), Nametag.toRef(nametag_id)]
                ),
                collab_exists: q.Exists(q.Var('collab'))
              },
              q.If(
                q.Var('collab_exists'),
                q.Get(q.Select(['data', 'nametag_ref'], q.Get(q.Var('collab')))),
                null
              )
            )
          )
        )
      );

      if (query !== null) return Nametag.parseFQL(query);
    } catch (e) {
      console.error('db/Nametag.verifyOwnership', e);
      return undefined;
    }
  }

  static async getByAccountId(account_id: string) {
    let response: { nametags: ServerNametag[]; collabs: ClientNametagCollab[] } = {
      nametags: [],
      collabs: []
    };

    try {
      const query = await Fauna.client().query<{ nametags: any[]; collabs: any[] }>(
        q.Let(
          {
            nametags: q.Map(
              q.Paginate(
                q.Match(q.Index('nametags_by_account_ref'), [
                  Account.toRef(account_id)
                ])
              ),
              q.Lambda('nametag_ref', q.Get(q.Var('nametag_ref')))
            ),
            collabs: q.Map(
              q.Paginate(
                q.Match(q.Index('collabs_by_authorized_account_ref'), [
                  Account.toRef(account_id)
                ])
              ),
              q.Lambda('collab_ref', q.Get(q.Var('collab_ref')))
            )
          },
          {
            nametags: q.Select(['data'], q.Var('nametags')),
            collabs: q.Map(
              q.Select(['data'], q.Var('collabs')),
              q.Lambda('collab', {
                authorized_nametag: q.Get(
                  q.Select(['data', 'authorized_nametag_ref'], q.Var('collab'))
                ),
                nametag: q.Get(q.Select(['data', 'nametag_ref'], q.Var('collab')))
              })
            )
          }
        )
      );

      response = {
        nametags: query.nametags.map((n) => Nametag.parseFQL(n)),
        collabs: query.collabs.map((c) => NametagCollab.parseFQL(c))
      };
    } catch (e) {
      console.error('db/Nametag.getByAccountId:', e);
    }

    return response;
  }

  static async getById(nametag_id: string) {
    return await Fauna.get<ServerNametag>(
      Nametag.toRef(nametag_id),
      Nametag.parseFQL
    );
  }

  static async getClientNametagById(nametag_id: string) {
    return await Fauna.get<ClientNametag>(
      Nametag.toRef(nametag_id),
      Nametag.parseClientFQL
    );
  }

  static async getFriends(
    nametag_id: string
  ): Promise<NametagRelationshipsGetFriendsRequest> {
    try {
      const query = await Fauna.client().query<
        { data: (object | null)[] } | undefined
      >(
        q.Map(
          q.Paginate(
            q.Match(q.Index('friends_by_nametag_ref'), [Nametag.toRef(nametag_id)])
          ),
          q.Lambda(
            'rel_ref',
            q.Let(
              {
                rel: q.Get(q.Var('rel_ref')),
                friend_exists: q.Exists(
                  q.Select(['data', 'friend_ref'], q.Var('rel'))
                )
              },
              q.If(
                q.Var('friend_exists'),
                q.Get(q.Select(['data', 'friend_ref'], q.Var('rel'))),
                q.Let(
                  {
                    deleted: q.Delete(q.Var('rel_ref'))
                  },
                  null
                )
              )
            )
          )
        )
      );

      if (query) {
        return {
          success: true,
          nametags: query.data
            .filter((f) => f !== null)
            .map((f) => Nametag.parseClientFQL(f))
        };
      } else throw new Error('query was undefined', { cause: query });
    } catch (e) {
      console.error('db/nametag.getFriends()', e);
      return {
        success: false
      };
    }
  }

  static async getFollowers(
    nametag_id: string
  ): Promise<NametagRelationshipsGetFriendsRequest> {
    try {
      const query = await Fauna.client().query<
        { data: (object | null)[] } | undefined
      >(
        q.Map(
          q.Paginate(
            q.Match(q.Index('followers_by_nametag_ref'), [Nametag.toRef(nametag_id)])
          ),
          q.Lambda(
            'rel_ref',
            q.Let(
              {
                rel: q.Get(q.Var('rel_ref')),
                follower_exists: q.Exists(
                  q.Select(['data', 'follower_ref'], q.Var('rel'))
                )
              },
              q.If(
                q.Var('follower_exists'),
                q.Get(q.Select(['data', 'follower_ref'], q.Var('rel'))),
                q.Let(
                  {
                    deleted: q.Delete(q.Var('rel_ref'))
                  },
                  null
                )
              )
            )
          )
        )
      );

      if (query) {
        return {
          success: true,
          nametags: query.data
            .filter((f) => f !== null)
            .map((f) => Nametag.parseClientFQL(f))
        };
      } else throw new Error('query was undefined', { cause: query });
    } catch (e) {
      console.error('db/nametag.getFollowers()', e);
      return {
        success: false
      };
    }
  }

  static async create(account_id: string, draft: Partial<DraftNametag>) {
    const data = Object.assign(draft, {
      account_ref: Account.toRef(account_id),
      stripe: blankAccountStatus()
    });

    let nametag = await Fauna.create<ServerNametag>(
      Nametag.collection,
      data,
      Nametag.parseFQL
    );

    if (nametag) {
      const stats = await NametagStats.create(nametag.id, blankNametagStats());
      if (stats) {
        const latest = await Nametag.update(nametag.id, {
          stats_ref: NametagStats.toRef(stats.id)
        });

        if (latest) {
          nametag = latest;
        }
      }
    }

    return nametag;
  }

  static async update(id: string, data: Partial<ServerNametag>) {
    return await Fauna.update<ServerNametag>(
      Nametag.toRef(id),
      data,
      Nametag.parseFQL
    );
  }

  static async delete(id: string) {
    return await Fauna.delete(Nametag.toRef(id));
  }

  static parseFQL(fql: any) {
    return Fauna.parseFQL<ServerNametag>(fql, ['account_ref', 'stats_ref']);
  }

  static parseClientFQL(fql: any): ClientNametag {
    const nametag = Nametag.parseFQL(fql);

    return {
      id: nametag.id,
      nametag: nametag.nametag,
      theme: nametag.theme,
      profile_pic: nametag.profile_pic
    };
  }

  static toRef(id: string) {
    return Fauna.toRef(Nametag.collection, id);
  }
}
