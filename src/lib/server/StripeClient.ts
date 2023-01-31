import Stripe from 'stripe';

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
}
