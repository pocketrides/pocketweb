import { StripeClient } from '$lib/server/StripeClient';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async (event) => {
  let redirect_url = '/settings';

  if (event.locals.nametag?.stripe?.account_id) {
    const url = await StripeClient.createAccountDashboardLink(
      event.locals.nametag.stripe.account_id
    );

    if (url) redirect_url = url;
  }

  throw redirect(301, redirect_url);
}) satisfies RequestHandler;
