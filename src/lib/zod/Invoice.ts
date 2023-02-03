import { z } from 'zod';
import { client_ref_validator } from './Fauna';

export const draft_invoice_validator = z.object({
  stripe_invoice_id: z.string(),
  minted: z.boolean()
});

export const server_invoice_validator = draft_invoice_validator.extend({
  id: z.string(),
  account_ref: client_ref_validator
});

export type DraftInvoice = z.infer<typeof draft_invoice_validator>;
export type ServerInvoice = z.infer<typeof server_invoice_validator>;
