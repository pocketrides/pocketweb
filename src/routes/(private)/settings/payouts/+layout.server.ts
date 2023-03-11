import { StripeClient } from '$lib/server/StripeClient';
import { NametagStats } from '$lib/server/db/NametagStats';
import { Payout } from '$lib/server/db/Payout';
import type { LayoutServerLoad } from './$types';

export const load = (async (event) => {
  let can_create_account = false;
  let can_create_payouts = false;
  let total_likes = undefined;
  let stripe_account: any;

  if (event.locals.nametag_id) {
    const can_create = await Payout.canCreate(event.locals.nametag_id);

    can_create_account = can_create.can_create;
    total_likes = can_create.total_likes;
  }

  if (event.locals.nametag?.stripe?.account_id) {
    try {
      stripe_account = await StripeClient.retrieveAccount(
        event.locals.nametag.stripe.account_id
      );

      if (stripe_account) {
        can_create_payouts =
          stripe_account.charges_enabled === true && can_create_account;
      }
    } catch (e) {}
  }

  return {
    can_create_account,
    can_create_payouts,
    stripe_account,
    total_likes
  };
}) satisfies LayoutServerLoad;
