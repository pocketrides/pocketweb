import { StripeClient } from '$lib/server/StripeClient';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async (event) => {
  let redirect_url = '/settings';

  let stripe_account_id = event.locals.nametag?.stripe?.account_id;

  if (!stripe_account_id)
    stripe_account_id = await StripeClient.createAccount(
      event.locals.nametag_id as string,
      event.locals.nametag
    );

  if (stripe_account_id) {
    const refresh_url = `https://${event.url.host}/_/stripe/account/onboard`;
    const return_url = `https://${event.url.host}/_/stripe/account/return`;

    const link = await StripeClient.createAccountOnboardingLink(
      stripe_account_id,
      refresh_url,
      return_url
    );

    if (link) redirect_url = link;
  }

  throw redirect(302, redirect_url);
}) satisfies RequestHandler;
