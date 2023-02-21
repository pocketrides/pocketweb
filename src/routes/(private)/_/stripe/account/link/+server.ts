import { StripeClient } from '$lib/server/StripeClient';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Account } from '$lib/server/db/Account';

export const GET = (async (event) => {
  let redirect_url = '/account';

  if (event.locals.fauna_account_id) {
    const account = await Account.getByFaunaId(event.locals.fauna_account_id);

    if (account && account.stripe_account_id) {
      try {
        const account_link = await StripeClient.client().accounts.createLoginLink(
          account.stripe_account_id
        );

        redirect_url = account_link.url;
      } catch (e) {}
    }
  }

  throw redirect(301, redirect_url);
}) satisfies RequestHandler;
