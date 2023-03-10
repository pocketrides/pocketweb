import { StripeClient } from '$lib/server/StripeClient';
import { NametagStats } from '$lib/server/db/NametagStats';
import type { LayoutServerLoad } from './$types';

export const load = (async (event) => {
  let can_create_account = false;
  let can_create_payouts = false;
  let total_likes = undefined;
  let stripe_account;

  if (event.locals.nametag?.stats_ref?.id) {
    const stats = await NametagStats.get(event.locals.nametag.stats_ref.id);
    if (stats) {
      can_create_account = (stats.likes_received || 0) >= 500;
      total_likes = stats.likes_received;
    }
  }

  if (event.locals.nametag?.stripe?.account_id) {
    stripe_account = await StripeClient.retrieveAccount(
      event.locals.nametag.stripe.account_id
    );

    if (stripe_account) {
      can_create_payouts = stripe_account.charges_enabled === true;
    }
  }

  return {
    can_create_account,
    can_create_payouts,
    stripe_account,
    total_likes
  };
}) satisfies LayoutServerLoad;
