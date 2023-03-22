// messages interfaces
// handles things like replies and chats and in the future, DMs

import { z } from 'zod';
import { cloudinary_photo_validator } from './CloudinaryPhoto';
import { MAX_POST_CONTENT_LENGTH } from './Post';
import { link_validator } from './Link';
import type { ClientNametag } from './Nametag';

export const draft_message_text_validator = z.object({
  type: z.literal('text'),
  content: z.string().min(1).max(MAX_POST_CONTENT_LENGTH),
  content_raw: z.string()
});

export const draft_message_photos_validator = z.object({
  type: z.literal('photos'),
  photos: z.array(cloudinary_photo_validator)
});

export const draft_message_links_validator = z.object({
  type: z.literal('links'),
  links: z.array(link_validator)
});

export const draft_message_validator = z.discriminatedUnion('type', [
  draft_message_text_validator,
  draft_message_photos_validator,
  draft_message_links_validator
]);

export const messages_payload_validator = z.array(draft_message_validator).min(1);

export type DraftTextMessage = z.infer<typeof draft_message_text_validator>;
export type DraftPhotosMessage = z.infer<typeof draft_message_photos_validator>;
export type DraftLinksMessage = z.infer<typeof draft_message_links_validator>;
export type DraftAnyMessage =
  | DraftTextMessage
  | DraftPhotosMessage
  | DraftLinksMessage;
export type MessagesPayload = DraftAnyMessage[];
export type MessageComposerEvent = {
  messages: MessagesPayload;
  completeCallback: Function;
};
export type MessageComposerActiveEvent = {
  is_active: boolean;
};

export interface IServerMessage {
  id: string;
  ts: number;
  nametag: ClientNametag;
  messages: MessagesPayload;
}

export const blankMessage = (): DraftAnyMessage => {
  return {
    type: 'text',
    content: '',
    content_raw: ''
  };
};
