import { z } from 'zod';

export const draft_account_validator = z.object({
  stytch_id: z.string(),
  terms_version: z.string().optional(),
  stripe_customer_id: z.string().optional(),
  stripe_subscription_id: z.string().optional(),
  stripe_subscription_status: z.enum(['subscribed', 'unsubscribed']).optional(),
  stripe_account_id: z.string().optional(),
  charges_enabled: z.boolean().optional()
});

export type DraftAccount = z.infer<typeof draft_account_validator>;

export type ServerAccount = DraftAccount & {
  id: string;
};
