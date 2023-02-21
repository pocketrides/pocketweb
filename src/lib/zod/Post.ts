import { link_validator } from './Link';
import { cloudinary_photo_validator } from './CloudinaryPhoto';
import { z } from 'zod';
import { server_nametag_validator, type ServerNametag } from './Nametag';
import { server_post_stats_validator, type ServerPostStats } from './PostStats';
import { client_ref_validator, type ClientRef } from './Fauna';
import type { Expr } from 'faunadb';

export const MAX_POST_CONTENT_LENGTH = 720;

export const post_audience_validator = z.enum([
  'friends',
  'close_friends',
  'pocket'
]);

export const post_settings = z.object({
  is_nsfw: z.boolean(),
  enable_likes: z.boolean(),
  enable_replies: z.boolean()
});

export const draft_post_content_validator = z.object({
  content: z.string().min(1).max(MAX_POST_CONTENT_LENGTH),
  content_raw: z.string(),
  photos: z.array(cloudinary_photo_validator),
  links: z.array(link_validator)
});

export const draft_post_validator = z.object({
  audience: post_audience_validator,
  pocket_id: z.string().optional(),
  settings: post_settings,
  contents: z.array(draft_post_content_validator).min(1)
});

export const server_post_shape = z.object({
  id: z.string(),
  ts: z.number(),
  nametag_ref: client_ref_validator,
  nametag: server_nametag_validator,
  settings: post_settings,
  contents: z.array(draft_post_content_validator).min(1),
  stats_ref: client_ref_validator,
  stats: server_post_stats_validator,

  // these are bolted on by Like.isPostLiked()
  is_liked: z.boolean().optional(),
  is_quarantined: z.boolean().optional()
});

export const server_post_validator = z.discriminatedUnion('audience', [
  server_post_shape.extend({
    audience: z.literal('pocket'),
    pocket: z.object({
      id: z.string(),
      name: z.string()
    })
  }),
  server_post_shape.extend({
    audience: z.enum(['friends', 'close_friends'])
  })
]);

export type PostSettings = z.infer<typeof post_settings>;
export type PostContent = z.infer<typeof draft_post_content_validator>;
export type DraftPostContent = z.infer<typeof draft_post_content_validator>;
export type DraftPost = z.infer<typeof draft_post_validator>;
export type ServerPost = {
  id: string;
  ts: number;
  audience: 'friends' | 'close_friends' | 'pocket';
  nametag_ref: ClientRef | Expr;
  nametag: ServerNametag;
  settings: PostSettings;
  contents: PostContent[];
  stats_ref: ClientRef | Expr;
  stats: ServerPostStats;

  is_liked?: boolean;
  is_quarantined?: boolean;
};

export const blankPostContent = (): DraftPostContent => {
  return {
    content: '',
    content_raw: '',
    photos: [],
    links: []
  };
};

export const blankPost = (): DraftPost => {
  return {
    audience: 'friends',
    pocket_id: undefined,
    settings: {
      is_nsfw: false,
      enable_likes: true,
      enable_replies: true
    },
    contents: [blankPostContent()]
  };
};
