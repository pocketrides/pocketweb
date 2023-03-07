import Stripe from 'stripe';
import { Account } from './db/Account';
import type { ServerAccount } from '$lib/zod/Account';
import { blankAccountStatus, type StripeAccountStatus } from '$lib/zod/Stripe';
import { Invoice } from './db/Invoice';
import { Like } from './db/Like';
import { Nametag } from './db/Nametag';
import type { DraftNametag, ServerNametag } from '$lib/zod/Nametag';

export type StripeClientCustomMetadata = {
  nametag_id: string;
};

export class StripeClient {
  static STRIPE_KEY: string;
  static STRIPE_SIGNING_SECRET: string;
  static STRIPE_PRICE_ID: string;

  static crypto() {
    return Stripe.createSubtleCryptoProvider();
  }

  static client() {
    return new Stripe(StripeClient.STRIPE_KEY, {
      httpClient: Stripe.createFetchHttpClient(),
      apiVersion: '2022-11-15'
    });
  }

  static getMetadata(nametag_id: string): StripeClientCustomMetadata {
    return {
      nametag_id
    };
  }

  static async getAccountStatus(
    nametag_id: string,
    nametag?: ServerNametag
  ): Promise<StripeAccountStatus> {
    if (!nametag) nametag = await Nametag.getById(nametag_id);

    if (!nametag || !nametag.stripe) return blankAccountStatus();

    return nametag.stripe as StripeAccountStatus;
  }

  static async createAccount(
    nametag_id: string,
    nametag?: ServerNametag
  ): Promise<string | undefined> {
    if (!nametag) nametag = await Nametag.getById(nametag_id);

    if (nametag?.stripe?.account_id) return nametag.stripe.account_id;

    try {
      const stripe_account = await this.client().accounts.create({
        type: 'standard',
        business_profile: {
          url: `https://pocketrides.com/profile/${nametag_id}`,
          mcc: '7299'
        },
        metadata: StripeClient.getMetadata(nametag_id)
      });

      await Nametag.update(nametag_id, {
        stripe: { account_id: stripe_account.id, has_account: true }
      });

      return stripe_account.id;
    } catch (e) {
      return undefined;
    }
  }

  static async createAccountOnboardingLink(
    stripe_account_id: string,
    refresh_url: string,
    return_url: string
  ): Promise<string | undefined> {
    try {
      const account_link = await this.client().accountLinks.create({
        account: stripe_account_id,
        return_url,
        refresh_url,
        type: 'account_onboarding'
      });

      return account_link.url;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }

  // for subscribing
  static async createSubscribeLink(
    nametag_id: string,
    return_url: string
  ): Promise<string | undefined> {
    try {
      const metadata: StripeClientCustomMetadata = { nametag_id };

      const link = await this.client().checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: this.STRIPE_PRICE_ID, quantity: 1 }],
        client_reference_id: metadata.nametag_id,
        subscription_data: {
          metadata
        },
        metadata,
        success_url: return_url
      });

      if (link.url) return link.url;

      return undefined;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  // for managing payouts
  static async createAccountDashboardLink(
    stripe_account_id: string
  ): Promise<string | undefined> {
    try {
      const link = await this.client().accounts.createLoginLink(stripe_account_id);

      return link.url;
    } catch (e) {
      return undefined;
    }
  }

  // for managing subscription
  static async createBillingPortalLink(
    stripe_customer_id: string,
    return_url: string
  ): Promise<string | undefined> {
    try {
      const link = await this.client().billingPortal.sessions.create({
        customer: stripe_customer_id,
        return_url
      });

      return link.url;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  static async transfer(
    target_stripe_account: string,
    amount: number
  ): Promise<Stripe.Transfer | undefined> {
    try {
      const transfer = await this.client().transfers.create({
        amount,
        currency: 'usd',
        destination: target_stripe_account
      });

      return transfer;
    } catch (e) {
      return undefined;
    }
  }

  /**
   * Handles createPaymentLink()'s checkout.session.completed event, and adds the fauna_account_id metadata to both the customer and subscription objects.
   */
  static async handleCheckoutSessionCompletedEvent(event: Stripe.Event) {
    const checkout_session = event.data.object as Stripe.Checkout.Session;
    const metadata = checkout_session.metadata as StripeClientCustomMetadata;
    const customer_id = checkout_session.customer as string;
    const subscription_id = checkout_session.subscription as string;

    if (metadata.nametag_id && customer_id && subscription_id) {
      await Nametag.update(metadata.nametag_id, {
        stripe: {
          cus_id: customer_id,
          sub_id: subscription_id
        }
      });

      await this.client().customers.update(customer_id, {
        metadata
      });

      await this.client().subscriptions.update(subscription_id, {
        metadata
      });
    }
  }

  // manually sync the subscription's metadata over to the customer so subsequent calls succeed
  static async handleSubscriptionCreatedEvent(event: Stripe.Event) {
    const subscription = event.data.object as Stripe.Subscription;
    const customer_id = subscription.customer as string;
    const metadata = subscription.metadata as StripeClientCustomMetadata;

    await this.client().customers.update(customer_id, {
      metadata
    });
  }

  /**
   * Handles webhooks for all customer.subscription.* events to update the account's subscription status
   */
  static async handleCustomerSubscriptionEvent(event: Stripe.Event) {
    const event_type = event.type;
    const subscription = event.data.object as Stripe.Subscription;
    const metadata = subscription.metadata as StripeClientCustomMetadata;
    const is_active = subscription.status === 'active';

    if (metadata.nametag_id) {
      let update_data: Partial<DraftNametag> = {
        stripe: {
          has_sub: is_active,
          free_mode: is_active ? false : true,
          sub_id: subscription.id
        }
      };

      if (event_type === 'customer.subscription.deleted') {
        update_data = {
          stripe: {
            has_sub: false,
            free_mode: true,
            sub_id: undefined
          }
        };
      }

      await Nametag.update(metadata.nametag_id, update_data);
    }
  }

  static async handleInvoicePaidEvent(event: Stripe.Event) {
    const invoice = event.data.object as Stripe.Invoice;
    const stripe_invoice_id = invoice.id;
    const metadata = invoice.lines.data[0].metadata as StripeClientCustomMetadata;

    if (metadata && metadata.nametag_id) {
      const exists = await Invoice.getByStripeInvoiceId(stripe_invoice_id);

      if (exists === undefined) {
        const invoice_record = await Invoice.create(metadata.nametag_id, {
          stripe_invoice_id,
          minted: false
        });

        if (invoice_record) {
          await Like.mint(metadata.nametag_id, invoice_record.id);
        }
      }
    }
  }

  static async handleAccountUpdatedEvent(event: Stripe.Event) {
    const account = event.data.object as Stripe.Account;
    const account_metadata = account.metadata as StripeClientCustomMetadata;

    if (account_metadata && account_metadata.nametag_id) {
      await Nametag.update(account_metadata.nametag_id, {
        stripe: { charges_enabled: account.charges_enabled === true }
      });
    }
  }
}
