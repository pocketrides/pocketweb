import { z } from 'zod';
import { Api } from '../api';

export class StripePaymentLink {
  static endpoint = '/_/stripe/payment-link';

  static response = z.discriminatedUnion('success', [
    z.object({
      success: z.literal(true),
      url: z.string()
    }),
    Api.generic_failure_validator
  ]);

  static async get() {
    return await Api.get<StripePaymentLinkResponse>(
      StripePaymentLink.endpoint,
      StripePaymentLink.response
    );
  }
}

export type StripePaymentLinkResponse = z.infer<typeof StripePaymentLink.response>;
