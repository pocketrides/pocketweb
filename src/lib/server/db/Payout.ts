import type { ServerPayout } from '$lib/zod/Payout';
import { Fauna, q } from './Fauna';
import { Nametag } from './Nametag';

export class Payout {
  static collection = 'payouts';
  static payouts_by_status_index = 'payouts_by_nametag_ref_and_status';

  static async createOrContinue(nametag_id: string): Promise<ServerPayout> {
    const req = await Fauna.client().query<{ payout: any }>(
      q.Let(
        {
          match: q.Union(
            q.Match(q.Index(this.payouts_by_status_index), [
              Nametag.toRef(nametag_id),
              'idle'
            ]),
            q.Match(q.Index(this.payouts_by_status_index), [
              Nametag.toRef(nametag_id),
              'processing'
            ]),
            q.Match(q.Index(this.payouts_by_status_index), [
              Nametag.toRef(nametag_id),
              'processing_error'
            ])
          ),
          match_exists: q.Exists(q.Var('match')),
          payout: q.If(q.Var('match_exists'), q.Get(q.Var('match')), null),
          has_payout: q.If(q.IsNull(q.Var('payout')), false, true)
        },
        q.Do(
          q.If(
            q.Var('has_payout'),
            { payout: q.Var('payout') },
            q.Let(
              {
                boundary: q.Match(q.Index('likes_by_target_nametag_ref'), [
                  Nametag.toRef(nametag_id)
                ]),
                first_page: q.Paginate(q.Var('boundary'), { size: 1 }),
                has_first_page: q.ContainsPath(['data', 0], q.Var('first_page')),
                first_like_ref: q.If(
                  q.Var('has_first_page'),
                  q.Select(['data', 0], q.Var('first_page')),
                  null
                ),
                last_page: q.Paginate(q.Var('boundary'), { size: 1, before: null }),
                has_last_page: q.ContainsPath(['data', 0], q.Var('last_page')),
                last_like_ref: q.If(
                  q.Var('has_last_page'),
                  q.Select(['data', 0], q.Var('last_page')),
                  null
                ),
                count: q.Select(
                  ['data', 0],
                  q.Count(q.Paginate(q.Var('boundary'), { size: 10000 }))
                ),
                count_is_exact: q.If(q.Equals(q.Var('count'), 10000), false, true)
              },
              {
                payout: q.Create(this.collection, {
                  data: {
                    nametag_ref: Nametag.toRef(nametag_id),
                    status: 'idle',
                    first_like_ref: q.Var('first_like_ref'),
                    last_like_ref: q.Var('last_like_ref'),
                    count: q.Var('count'),
                    is_exact: q.Var('count_is_exact'),
                    grand_total: 0
                  }
                })
              }
            )
          )
        )
      )
    );

    return this.parseFQL(req.payout);
  }

  static async updateStatus(
    payout_id: string,
    nametag_id: string,
    new_status: ServerPayout['status'],
    error_status?: ServerPayout['error_status']
  ) {
    const req = await Fauna.client().query<{ payout?: any }>(
      q.Let(
        {
          payout_ref: this.toRef(payout_id),
          payout_exists: q.Exists(q.Var('payout_ref')),
          payout: q.If(q.Var('payout_exists'), q.Get(q.Var('payout_ref')), null),
          has_payout: q.If(q.IsNull(q.Var('payout')), false, true),
          can_update: q.And(
            q.Var('has_payout'),
            q.Equals(
              Nametag.toRef(nametag_id),
              q.Select(['data', 'nametag_ref'], q.Var('payout'))
            )
          )
        },
        q.If(
          q.Var('can_update'),
          {
            payout: q.Update(q.Var('payout_ref'), {
              data: {
                status: new_status,
                error_status: error_status ? error_status : null
              }
            })
          },
          { payout: null }
        )
      )
    );

    if (req.payout) {
      const payout = this.parseFQL(req.payout);

      return payout;
    }

    return undefined;
  }

  static async get(payout_id: string): Promise<ServerPayout | undefined> {
    try {
      return await Fauna.get<ServerPayout>(this.toRef(payout_id), this.parseFQL);
    } catch (e) {
      return undefined;
    }
  }

  static toRef(id: string) {
    return Fauna.toRef(this.collection, id);
  }

  static parseFQL(fql: any) {
    return Fauna.parseFQL<ServerPayout>(fql, [
      'nametag_ref',
      'first_like_ref',
      'last_like_ref'
    ]);
  }
}
