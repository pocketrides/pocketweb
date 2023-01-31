import type { StripePaymentLinkResponse } from '$lib/api/stripe/payment_link';
import { StripeClient } from '$lib/server/StripeClient';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async (event) => {
  let response: StripePaymentLinkResponse = { success: false };

  const request_url = new URL(event.request.url);
  const redirect_url = `https://${request_url.host}/profile/${event.locals.nametag_id}`;

  const url = await StripeClient.createPaymentLink(
    event.locals.fauna_account_id as string,
    redirect_url
  );

  if (url) {
    response = { success: true, url };
  }

  return json(response);
}) satisfies RequestHandler;
