import Stripe from 'stripe';
import { Account } from './db/Account';
import { object } from 'zod';

type StripeClientCustomMetadata = {
  fauna_account_id: string;
};

export class StripeClient {
  static STRIPE_KEY: string;
  static STRIPE_SIGNING_SECRET: string;

  static crypto() {
    return Stripe.createSubtleCryptoProvider();
  }

  static client() {
    return new Stripe(StripeClient.STRIPE_KEY, {
      httpClient: Stripe.createFetchHttpClient(),
      apiVersion: '2022-11-15'
    });
  }

  static async createPaymentLink(fauna_account_id: string, redirect: string) {
    const link = await StripeClient.client().paymentLinks.create({
      line_items: [
        {
          price: 'price_1LqglBLgF5G1GDOmlQtI2Fjj',
          quantity: 1
        }
      ],
      metadata: { fauna_account_id },
      after_completion: {
        type: 'redirect',
        redirect: { url: redirect }
      }
    });

    return link.url;
  }

  static async handleCheckoutSessionCompleted(event: Stripe.Event) {
    const checkout_session = event.data.object as Stripe.Checkout.Session;
    const metadata = checkout_session.metadata as StripeClientCustomMetadata;
    const customer = checkout_session.customer;
    const customer_id =
      typeof customer === 'string'
        ? customer
        : customer !== null
        ? customer.id
        : undefined;

    if (customer_id) {
      await Account.update(metadata.fauna_account_id, {
        stripe_customer_id: customer_id
      });

      await StripeClient.client().customers.update(customer_id, {
        metadata
      });
    }
  }
}
