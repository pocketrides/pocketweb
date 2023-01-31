import { StripeClient } from '$lib/server/StripeClient';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST = (async (event) => {
  const stripe = StripeClient.client();
  const secret = StripeClient.STRIPE_SIGNING_SECRET;
  const signature = event.request.headers.get('Stripe-Signature');

  if (signature === null) return json({});

  const webhook_event = await stripe.webhooks.constructEventAsync(
    await event.request.text(),
    signature,
    secret,
    undefined,
    StripeClient.crypto()
  );

  switch (webhook_event.type) {
  }

  return json({});
}) satisfies RequestHandler;
