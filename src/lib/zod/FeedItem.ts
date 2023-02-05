/**
 * a nametag's or pocket's home feed
 * a giant collection of posts, notifications, whatever else.
 * you can create a feed item for a pocket or nametag, Publisher takes care of pushing it out
 */

import { z } from 'zod';
import { client_ref_validator } from './Fauna';

export const draft_feed_item_validator = z.object({
  // whose feed it will appear on
  nametag_id: z.string().optional(),
  // which pocket's feed it will appear on
  pocket_id: z.string().optional(),
  // if it's a post, the ID of that post
  post_id: z.string().optional(),
  // if it's a notification, the ID of that notification
  notification_id: z.string().optional()
});

export const server_feed_item_validator = z.object({
  id: z.string(),

  // whose feed this should appear on
  nametag_ref: client_ref_validator.optional(),
  pocket_ref: client_ref_validator.optional(),

  // what it actually is
  post_ref: client_ref_validator.optional(),
  notification_ref: client_ref_validator.optional()
});

export type DraftFeedItem = z.infer<typeof draft_feed_item_validator>;
export type ServerFeedItem = z.infer<typeof server_feed_item_validator>;
