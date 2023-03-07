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
    case 'checkout.session.completed':
      // console.log('> checkout session event');
      await StripeClient.handleCheckoutSessionCompletedEvent(webhook_event);
      break;
    case 'customer.subscription.created':
      // console.log('> subscription created');
      await StripeClient.handleSubscriptionCreatedEvent(webhook_event);
      break;
    case 'customer.subscription.deleted':
    case 'customer.subscription.updated':
      // console.log('> subscription event');
      await StripeClient.handleCustomerSubscriptionEvent(webhook_event);
      break;
    case 'invoice.paid':
      // console.log('> invoice event');
      await StripeClient.handleInvoicePaidEvent(webhook_event);
      break;
    case 'account.updated':
      // console.log('> account event');
      await StripeClient.handleAccountUpdatedEvent(webhook_event);
      break;
  }

  return json({});
}) satisfies RequestHandler;
