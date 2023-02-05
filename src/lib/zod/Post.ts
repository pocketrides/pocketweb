import { z } from 'zod';
import { client_ref_validator } from './Fauna';
import { server_post_stats_validator } from './PostStats';

export const draft_post_photo_validator = z.object({
  public_id: z.string(),
  version: z.number().optional(),
  aws_rek_status: z.enum(['approved', 'rejected', 'unknown']).optional(),
  alt_text: z.string().optional()
});

export const draft_post_attachment_validator = z.object({
  link: z.string(),
  attempted: z.boolean().optional(),
  og_image: z.string().optional(),
  og_title: z.string().optional(),
  og_desc: z.string().optional(),
  disabled: z.boolean().optional()
});

export const draft_post_validator = z.object({
  content: z.string().min(1),
  thread_id: z.string().optional(),
  photos: z.array(draft_post_photo_validator),
  attachments: z.array(draft_post_attachment_validator)
});

export const server_post_validator = draft_post_validator.extend({
  id: z.string(),
  nametag_ref: client_ref_validator,

  // stats is bolted-on (but is separate so that post's `ts` can be used)
  stats: server_post_stats_validator.optional()
});

export type DraftPost = z.infer<typeof draft_post_validator>;
export type DraftPostPhoto = z.infer<typeof draft_post_photo_validator>;
export type DraftPostAttachment = z.infer<typeof draft_post_attachment_validator>;
export type ServerPost = z.infer<typeof server_post_validator>;

export const blankPost = (thread_id?: string): DraftPost => {
  return {
    content: '',
    thread_id,
    photos: [],
    attachments: []
  };
};
