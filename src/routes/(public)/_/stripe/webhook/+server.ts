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
      await StripeClient.handleCheckoutSessionCompletedEvent(webhook_event);
      break;
    case 'customer.deleted':
      await StripeClient.handleCustomerDeletedEvent(webhook_event);
      break;
    case 'customer.subscription.created':
    case 'customer.subscription.deleted':
    case 'customer.subscription.updated':
    case 'customer.subscription.paused':
    case 'customer.subscription.resumed':
      await StripeClient.handleCustomerSubscriptionEvent(webhook_event);
      break;
    case 'invoice.paid':
      await StripeClient.handleInvoicePaidEvent(webhook_event);
      break;
    case 'account.updated':
      await StripeClient.handleAccountUpdatedEvent(webhook_event);
      break;
  }

  return json({});
}) satisfies RequestHandler;
