import { z } from 'zod';
import { THEME_VALUES, type ThemeValue } from './Theme';
import { client_ref_validator, type ClientRef } from './Fauna';
import {
  server_nametag_stats_validator,
  type ServerNametagStats
} from './NametagStats';
import type { Expr } from 'faunadb';
import { stripe_account_status_validator, type StripeAccountStatus } from './Stripe';

export const draft_nametag_validator = z.object({
  nametag: z.string().min(1).max(32),
  theme: z.enum(THEME_VALUES),
  stripe: stripe_account_status_validator.optional()
});

export const server_nametag_validator = draft_nametag_validator.extend({
  id: z.string(),
  account_ref: client_ref_validator,

  // stats is bolted-on in certain scenarios, e.g. on a profile page
  stats_ref: client_ref_validator.optional(),
  stats: server_nametag_stats_validator.optional()
});

export type DraftNametag = {
  nametag: string;
  theme: ThemeValue;
  stripe?: Partial<StripeAccountStatus>;
  stats_ref?: Expr;
};

export type ServerNametag = DraftNametag & {
  id: string;
  account_ref: ClientRef | Expr;

  stripe?: StripeAccountStatus | Partial<StripeAccountStatus>;
  stats_ref?: ClientRef | any;
  stats?: ServerNametagStats;
};

export const client_nametag_validator = z.object({
  id: z.string(),
  nametag: z.string().min(1).max(32),
  theme: z.enum(THEME_VALUES)
});

export type ClientNametag = {
  id: string;
  nametag: string;
  theme: ThemeValue;
};
