import { StripeClient } from '$lib/server/StripeClient';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async (event) => {
  let redirect_url = '/settings';

  if (event.locals.nametag?.stripe?.account_id) {
    const refresh_url = `https://${event.url.host}/_/stripe/account/onboard`;
    const return_url = `https://${event.url.host}/_/stripe/account/return`;

    const link = await StripeClient.createAccountOnboardingLink(
      event.locals.nametag.stripe.account_id,
      refresh_url,
      return_url
    );

    if (link) redirect_url = link;
  }

  throw redirect(301, redirect_url);
}) satisfies RequestHandler;
