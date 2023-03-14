import { z } from 'zod';
import type { ClientRef } from './Fauna';
import type { Expr } from 'faunadb';
import { client_nametag_validator, type ClientNametag } from './Nametag';
import { messages_payload_validator, type MessagesPayload } from './Message';

export const draft_reply_validator = z.object({
  messages: messages_payload_validator,
  post_id: z.string()
});

export const reply_stats_validator = z.object({
  likes: z.number(),
  quarantines: z.number(),
  replies: z.number()
});

export type ReplyStats = {
  likes: number;
  quarantines: number;
  replies: number;
};

export type ServerReply = {
  nametag_ref: ClientRef | Expr;
  post_ref: ClientRef | Expr;
  messages: MessagesPayload;
  stats: ReplyStats;
};

export const client_reply_validator = z.object({
  id: z.string(),
  ts: z.number(),
  nametag: client_nametag_validator,
  messages: messages_payload_validator,
  stats: reply_stats_validator,
  pending: z.boolean().optional()
});

export type ClientReply = {
  id: string;
  ts: number;
  nametag: ClientNametag;
  messages: MessagesPayload;
  stats: ReplyStats;
  pending?: boolean;
};

export const blankReplyStats = (): ReplyStats => {
  return {
    likes: 0,
    quarantines: 0,
    replies: 0
  };
};
