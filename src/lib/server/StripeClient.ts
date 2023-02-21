import Stripe from 'stripe';
import { Account } from './db/Account';
import { Invoice } from './db/Invoice';
import { Like } from './db/Like';
import type { ServerAccount } from '$lib/zod/Account';

export type StripeClientCustomMetadata = {
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

  /**
   * Handles createPaymentLink()'s checkout.session.completed event, and adds the fauna_account_id metadata to both the customer and subscription objects.
   */
  static async handleCheckoutSessionCompletedEvent(event: Stripe.Event) {
    const checkout_session = event.data.object as Stripe.Checkout.Session;
    const metadata = checkout_session.metadata as StripeClientCustomMetadata;
    const customer_id = checkout_session.customer as string;
    const subscription_id = checkout_session.subscription as string;
    const subscription = await StripeClient.client().subscriptions.retrieve(
      subscription_id
    );
    const subscription_status = subscription.status;
    const is_active = subscription_status === 'active';

    if (metadata.fauna_account_id && customer_id && subscription_id) {
      await Account.update(metadata.fauna_account_id, {
        stripe_customer_id: customer_id,
        stripe_subscription_id: subscription_id,
        stripe_subscription_status: is_active ? 'subscribed' : 'unsubscribed'
      });

      await StripeClient.client().customers.update(customer_id, {
        metadata
      });

      await StripeClient.client().subscriptions.update(subscription_id, {
        metadata
      });

      if (checkout_session.invoice) {
        const existing = await Invoice.getByStripeInvoiceId(
          checkout_session.invoice as string
        );

        if (existing === undefined) {
          const invoice = await Invoice.create(metadata.fauna_account_id, {
            stripe_invoice_id: checkout_session.invoice as string,
            minted: false
          });

          if (invoice) {
            await Like.mint(metadata.fauna_account_id, invoice.id);
          }
        }
      }
    }
  }

  /**
   * Handles webhooks for all customer.subscription.* events to update the account's subscription status
   */
  static async handleCustomerSubscriptionEvent(event: Stripe.Event) {
    const event_type = event.type;
    const subscription = event.data.object as Stripe.Subscription;
    const metadata = subscription.metadata as StripeClientCustomMetadata;
    const is_active = subscription.status === 'active';

    if (metadata.fauna_account_id) {
      const update_data: Partial<ServerAccount> = {
        stripe_subscription_status: is_active ? 'subscribed' : 'unsubscribed'
      };

      if (event_type === 'customer.subscription.deleted') {
        update_data.stripe_subscription_id = undefined;
      }

      await Account.update(metadata.fauna_account_id, update_data);
    }
  }

  static async handleCustomerDeletedEvent(event: Stripe.Event) {
    const customer = event.data.object as Stripe.Customer;
    const metadata = customer.metadata as StripeClientCustomMetadata;

    await Account.update(metadata.fauna_account_id, {
      stripe_customer_id: undefined
    });
  }

  static async handleInvoicePaid(event: Stripe.Event) {
    const invoice = event.data.object as Stripe.Invoice;
    const customer_id = invoice.customer as string;
    const customer = await StripeClient.client().customers.retrieve(customer_id);
    const customer_metadata =
      !customer.deleted && (customer.metadata as StripeClientCustomMetadata);
    const stripe_invoice_id = invoice.id;

    if (customer_metadata && customer_metadata.fauna_account_id) {
      const exists = await Invoice.getByStripeInvoiceId(stripe_invoice_id);

      if (exists === undefined) {
        const invoice_record = await Invoice.create(
          customer_metadata.fauna_account_id,
          {
            stripe_invoice_id,
            minted: false
          }
        );

        if (invoice_record) {
          await Like.mint(customer_metadata.fauna_account_id, invoice_record.id);
        }
      }
    }
  }
}
