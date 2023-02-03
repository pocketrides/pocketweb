import { z } from 'zod';
import { client_ref_validator } from './Fauna';

export const draft_like_validator = z.object({
  post_id: z.string().optional(),
  reply_id: z.string().optional(),
  chat_id: z.string().optional()
});

export const server_like_validator = z.object({
  account_ref: client_ref_validator,
  invoice_ref: client_ref_validator,
  available: z.boolean(),
  post_ref: client_ref_validator.optional(),
  reply_ref: client_ref_validator.optional(),
  chat_ref: client_ref_validator.optional()
});

export type DraftLike = z.infer<typeof draft_like_validator>;
export type ServerLike = z.infer<typeof server_like_validator>;
