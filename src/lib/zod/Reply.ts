import { z } from 'zod';
import type { ClientRef } from './Fauna';
import type { Expr } from 'faunadb';
import type { ServerNametag } from './Nametag';

export const draft_reply_validator = z.object({
  content: z.string().min(1).max(240),
  reply_id: z.string().optional()
});

export type ServerReply = {
  reply_ref?: ClientRef | Expr;
  nametag_ref: ClientRef | Expr;
  nametag: ServerNametag;
  post_ref: ClientRef | Expr;
  content: string;
  stats: {
    likes: number;
    quarantines: number;
    replies: number;
  };
};
