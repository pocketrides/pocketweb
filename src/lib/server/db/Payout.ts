import { StripeClient } from '$lib/server/StripeClient';
import type { ServerPayout } from '$lib/zod/Payout';
import type { RequestEvent } from '@sveltejs/kit';
import { Fauna, q } from './Fauna';
import { Nametag } from './Nametag';
import type { ClientRef } from '$lib/zod/Fauna';
import type { Expr } from 'faunadb';
import * as Sentry from '@sentry/svelte';

type PayoutBoundaryFQL = {
  boundary: Expr;
  first_page: Expr;
  has_first_page: Expr;
  first_like_ref: Expr;
  last_page: Expr;
  has_last_page: Expr;
  last_like_ref: Expr;
  range: Expr;
  count: Expr;
  count_is_exact: Expr;
  can_create: Expr;
};

type CanCreateResponse = {
  can_create: boolean;
  total_likes: number;
};

export class Payout {
  static collection = 'payouts';
  static payouts_by_status_index = 'payouts_by_nametag_ref_and_status';

  static async createOrContinue(
    nametag_id: string
  ): Promise<ServerPayout | undefined> {
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
            ]),
            q.Match(q.Index(this.payouts_by_status_index), [
              Nametag.toRef(nametag_id),
              'transfer_ready'
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
              this.getBoundaryFQL(nametag_id),
              q.If(
                q.Var('can_create'),
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
                },
                { payout: null }
              )
            )
          )
        )
      )
    );

    if (req.payout) return this.parseFQL(req.payout);

    return undefined;
  }

  static async canCreate(nametag_id: string): Promise<CanCreateResponse> {
    try {
      const req = await Fauna.client().query<CanCreateResponse>(
        q.Let(this.getBoundaryFQL(nametag_id), {
          can_create: q.Var('can_create'),
          total_likes: q.Var('count')
        })
      );

      return req;
    } catch (e) {
      Sentry.captureException(e);
      return { can_create: false, total_likes: 0 };
    }
  }

  static getBoundaryFQL(nametag_id: string): PayoutBoundaryFQL {
    return {
      boundary: q.Match(q.Index('likes_by_target_nametag_ref_and_payout_ref'), [
        Nametag.toRef(nametag_id),
        null
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
      range: q.If(
        q.And(q.IsNull(q.Var('first_like_ref')), q.IsNull(q.Var('last_like_ref'))),
        null,
        q.Range(q.Var('boundary'), q.Var('first_like_ref'), q.Var('last_like_ref'))
      ),
      count: q.If(
        q.IsNull(q.Var('range')),
        q.Select(
          ['data', 0],
          q.Count(q.Paginate(q.Var('boundary'), { size: 10000 }))
        ),
        q.Select(['data', 0], q.Count(q.Paginate(q.Var('range'), { size: 10000 })))
      ),
      count_is_exact: q.If(q.Equals(q.Var('count'), 10000), false, true),
      can_create: q.GTE(q.Var('count'), 500)
    };
  }

  static async updateStatus(
    event: RequestEvent,
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
            q.GTE(q.Select(['data', 'count'], q.Var('payout')), 500),
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
                error_status: error_status || null
              }
            })
          },
          { payout: null }
        )
      )
    );

    if (req.payout) {
      let payout: ServerPayout | undefined = this.parseFQL(req.payout);

      if (
        new_status === 'processing' &&
        payout.status === 'processing' &&
        event.platform?.env.POCKETQUEUE
      ) {
        await event.platform.env.POCKETQUEUE.send({
          type: 'payout',
          data: {
            payout_id: payout.id,
            nametag_id,
            first_like_id: (payout.first_like_ref as ClientRef).id,
            last_like_id: (payout.last_like_ref as ClientRef).id
          }
        });
      }

      if (
        new_status === 'transferred' &&
        payout.status === 'transferred' &&
        event.locals.nametag?.stripe?.charges_enabled &&
        event.locals.nametag?.stripe?.account_id &&
        payout
      ) {
        try {
          const transfer = await StripeClient.transfer(
            event.locals.nametag.stripe.account_id,
            payout.grand_total
          );

          if (transfer)
            payout = await this.#update(payout.id, {
              stripe_transfer_id: transfer.id
            });
          else throw Error(`couldn't create transfer`, { cause: transfer });
        } catch (e) {
          Sentry.captureException(e);
          console.error('> transfer error', e);
          if (payout)
            payout = await this.#update(payout.id, {
              status: 'processing_error',
              error_status: 'failed_transfer'
            });
        }
      }

      return payout;
    }

    return undefined;
  }

  static async #update(payout_id: string, data: Partial<ServerPayout>) {
    return await Fauna.update<ServerPayout>(
      this.toRef(payout_id),
      data,
      this.parseFQL
    );
  }

  static async retrieve(
    payout_id: string,
    nametag_id: string
  ): Promise<ServerPayout | undefined> {
    return await Fauna.one<ServerPayout>(
      'payouts_by_ref_and_nametag_ref',
      [this.toRef(payout_id), Nametag.toRef(nametag_id)],
      this.parseFQL
    );
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
