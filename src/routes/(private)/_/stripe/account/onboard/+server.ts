import { StripeClient } from '$lib/server/StripeClient';
import { Account } from '$lib/server/db/Account';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async (event) => {
  let redirect_url = '/account';

  if (event.locals.fauna_account_id) {
    const account = await Account.getByFaunaId(event.locals.fauna_account_id);

    if (account && account.stripe_account_id) {
      const refresh_url = `https://${event.url.host}/_/stripe/account/onboard`;
      const return_url = `https://${event.url.host}/_/stripe/account/return`;

      try {
        const account_link = await StripeClient.client().accountLinks.create({
          account: account.stripe_account_id,
          type: 'account_onboarding',
          refresh_url,
          return_url
        });

        redirect_url = account_link.url;
      } catch (e) {}
    }
  }

  throw redirect(301, redirect_url);
}) satisfies RequestHandler;
