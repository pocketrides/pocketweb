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
  // nametag that did the liking
  nametag_ref: ClientRef | Expr | null;
  invoice_ref: ClientRef | Expr;

  available: boolean;

  // one of the possible targets
  post_ref?: ClientRef | Expr | null;
  reply_ref?: ClientRef | Expr | null;
  chat_ref?: ClientRef | Expr | null;
  // who ends up owning the like
  target_nametag_ref?: ClientRef | Expr | null;
  // if it's been transferred or not
  transferred?: boolean;
  stripe_transaction_id?: string;
};

export const like_post_payload_validator = z.object({
  post_id: z.string()
});

export const unlike_item_payload_validator = z.object({
  unlike_key: z.string()
});

export type LikePostPayload = {
  post_id: string;
};

export type UnlikeItemPayload = {
  unlike_key: string;
};

export type LikePostResponse =
  | { success: true; unlike_key: string }
  | {
      success: false;
      reason: 'out_of_likes' | 'likes_disabled' | 'ownership_chain' | 'idk';
    };

export type UnlikeItemResponse = boolean;
