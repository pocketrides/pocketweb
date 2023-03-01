import { StripeClient } from '$lib/server/StripeClient';
import { Account } from '$lib/server/db/Account';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async (event) => {
  if (event.locals.fauna_account_id) {
    const account = await Account.getByFaunaId(event.locals.fauna_account_id);
    if (account && account.stripe_account_id) {
      const stripe_account = await StripeClient.client().accounts.retrieve(
        account.stripe_account_id
      );

      await Account.update(event.locals.fauna_account_id, {
        charges_enabled: stripe_account.charges_enabled
      });
    }
  }

  throw redirect(301, '/account');
}) satisfies RequestHandler;
