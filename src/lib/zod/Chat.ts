import { z } from 'zod';
import { client_ref_validator, type ClientRef } from './Fauna';
import {
  messages_payload_validator,
  type IServerMessage,
  type MessagesPayload
} from './Message';
import { client_nametag_validator, type ClientNametag } from './Nametag';

export const draft_chat_validator = z.object({
  pocket_id: z.string(),
  messages: messages_payload_validator
});

export const client_chat_validator = z.object({
  id: z.string(),
  ts: z.number(),
  nametag_ref: client_ref_validator,
  nametag: client_nametag_validator,
  pocket_ref: client_ref_validator,
  messages: messages_payload_validator,
  pending: z.boolean().optional()
});

export type DraftChat = z.infer<typeof draft_chat_validator>;

export type ClientChat = IServerMessage & {
  id: string;
  ts: number;
  nametag: ClientNametag;
  pocket_ref: ClientRef;
  nametag_ref: ClientRef;
  messages: MessagesPayload;
  pending?: boolean;
};
