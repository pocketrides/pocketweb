import { StripeClient } from '$lib/server/StripeClient';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async (event) => {
  if (event.locals.nametag?.stripe?.cus_id) {
    const url = await StripeClient.createBillingPortalLink(
      event.locals.nametag.stripe.cus_id,
      `https://${event.url.host}/settings`
    );

    if (url) throw redirect(301, url);
  }

  throw redirect(301, '/settings');
}) satisfies RequestHandler;
