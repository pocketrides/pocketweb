import { StripeClient } from '$lib/server/StripeClient';
import type { ServerAccount } from '$lib/zod/Account';
import type Stripe from 'stripe';
import { Account } from './db/Account';

export class StripeClientV2 {
  static client = StripeClient.client;

  static async hasAccount(
    fauna_account_id: string,
    account?: ServerAccount
  ): Promise<boolean> {
    if (!account) account = await Account.getByFaunaId(fauna_account_id);

    if (!account) return false;

    return typeof account.stripe_account_id !== 'undefined';
  }

  static async chargesEnabled(
    fauna_account_id: string,
    account?: ServerAccount
  ): Promise<boolean> {
    if (!account) account = await Account.getByFaunaId(fauna_account_id);

    if (!account) return false;

    return account.charges_enabled === true;
  }

  /**
   * updates Account with the freshest charges_enabled and subscription_status info
   */
  static async refreshAccount(
    fauna_account_id: string,
    account?: ServerAccount
  ): Promise<boolean> {
    if (!account) account = await Account.getByFaunaId(fauna_account_id);

    if (!account) return false;

    if (!account.stripe_account_id) return false;

    if (!account.stripe_subscription_id) return false;

    const stripe_account = await this.client().accounts.retrieve(
      account.stripe_account_id
    );

    const stripe_subscription = await this.client().subscriptions.retrieve(
      account.stripe_subscription_id
    );

    const updated = await Account.update(fauna_account_id, {
      charges_enabled: stripe_account.charges_enabled,
      stripe_subscription_status:
        stripe_subscription.status === 'active' ? 'subscribed' : 'unsubscribed'
    });

    if (updated) return true;

    return false;
  }
}
