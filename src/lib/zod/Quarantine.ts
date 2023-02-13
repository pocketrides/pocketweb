import type { Expr } from 'faunadb';
import type { ClientRef } from './Fauna';
import { z } from 'zod';

export const draft_quarantine_validator = z.object({
  post_id: z.string().optional(),
  chat_id: z.string().optional(),
  reply_id: z.string().optional()
});

export type DraftQuarantine = z.infer<typeof draft_quarantine_validator>;

export type ServerQuarantine = {
  id: string;
  nametag_ref: ClientRef | Expr | null;
  post_ref?: ClientRef | Expr | null;
  reply_ref?: ClientRef | Expr | null;
  chat_ref?: ClientRef | Expr | null;
};
