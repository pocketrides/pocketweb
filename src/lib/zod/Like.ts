import { z } from 'zod';
import type { Expr } from 'faunadb';
import type { ClientRef } from './Fauna';

export const draft_like_payload = z.object({
  post_id: z.string().optional(),
  reply_id: z.string().optional(),
  chat_id: z.string().optional()
});

export const draft_like_validator = draft_like_payload.extend({
  nametag_id: z.string()
});

export type DraftLike = z.infer<typeof draft_like_validator>;
export type ServerLike = {
  id: string;
  account_ref: ClientRef | Expr;
  invoice_ref: ClientRef | Expr;
  available: boolean;

  nametag_ref?: ClientRef | Expr | null;
  post_ref?: ClientRef | Expr | null;
  reply_ref?: ClientRef | Expr | null;
  chat_ref?: ClientRef | Expr | null;
};
