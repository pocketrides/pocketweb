import { z } from 'zod';
import { client_ref_validator, type ClientRef } from './Fauna';
import type { Expr } from 'faunadb';

export const draft_invoice_validator = z.object({
  stripe_invoice_id: z.string(),
  minted: z.boolean()
});

export const server_invoice_validator = draft_invoice_validator.extend({
  id: z.string(),
  nametag_ref: client_ref_validator
});

export type DraftInvoice = {
  stripe_invoice_id: string;
  minted: boolean;
  nametag_ref?: Expr;
};

export type ServerInvoice = DraftInvoice & {
  id: string;
  nametag_ref: ClientRef | Expr;
};
