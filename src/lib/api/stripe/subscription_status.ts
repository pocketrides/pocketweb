import { z } from 'zod';
import { Api } from '../api';

export class StripeSubscriptionStatus {
  static endpoint = '/_/stripe/subscription/status';

  static response = z.discriminatedUnion('success', [
    z.object({
      success: z.literal(true),
      subscribed: z.boolean()
    }),
    Api.generic_failure_validator
  ]);

  static async get() {
    return await Api.get<StripeSubscriptionStatusResponse>(
      StripeSubscriptionStatus.endpoint,
      StripeSubscriptionStatus.response
    );
  }
}

export type StripeSubscriptionStatusResponse = z.infer<
  typeof StripeSubscriptionStatus.response
>;
