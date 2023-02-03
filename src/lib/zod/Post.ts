import { z } from 'zod';
import { client_ref_validator } from './Fauna';

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
  stats: z.object({
    likes: z.number(),
    quarantines: z.number(),
    replies: z.number()
  })
});

export type DraftPost = z.infer<typeof draft_post_validator>;
export type DraftPostPhoto = z.infer<typeof draft_post_photo_validator>;
export type DraftPostAttachment = z.infer<typeof draft_post_attachment_validator>;
export type ServerPost = z.infer<typeof server_post_validator>;

export const blankPostStats = () => {
  return {
    likes: 0,
    quarantines: 0,
    replies: 0
  };
};
