import { z } from 'zod';

export type StripeAccountStatus = {
  free_mode: boolean;
  has_sub: boolean;
  sub_id?: string;
  cus_id?: string;
  has_account: boolean;
  account_id?: string;
  charges_enabled: boolean;
};

export const stripe_account_status_validator = z.object({
  free_mode: z.boolean(),
  has_sub: z.boolean(),
  sub_id: z.string().optional(),
  cus_id: z.string().optional(),
  has_account: z.boolean(),
  account_id: z.string().optional(),
  charges_enabled: z.boolean()
});

export const blankAccountStatus = (): StripeAccountStatus => {
  return {
    free_mode: true,
    has_sub: false,
    has_account: false,
    charges_enabled: false
  };
};
