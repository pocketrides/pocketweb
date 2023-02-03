import type { StripeSubscriptionStatusResponse } from '$lib/api/stripe/subscription_status';
import { Account } from '$lib/server/db/Account';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async (event) => {
  let response: StripeSubscriptionStatusResponse = { success: false };

  if (event.locals.fauna_account_id) {
    const account = await Account.getByFaunaId(event.locals.fauna_account_id);

    if (account) {
      response = {
        success: true,
        subscribed: account.stripe_subscription_status === 'subscribed'
      };
    }
  }

  return json(response);
}) satisfies RequestHandler;
