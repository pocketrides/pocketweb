import { StripeClient } from '$lib/server/StripeClient';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async (event) => {
  if (event.locals.nametag_id) {
    const link = await StripeClient.createSubscribeLink(
      event.locals.nametag_id,
      `https://${event.url.host}/profile/${event.locals.nametag_id}?subscribed=1`
    );

    if (link) throw redirect(301, link);
  }

  throw redirect(301, `/profile/${event.locals.nametag_id}`);
}) satisfies RequestHandler;
