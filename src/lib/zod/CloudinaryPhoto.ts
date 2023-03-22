import { z } from 'zod';

export const cloudinary_upload_validator = z.object({
  public_id: z.string(),
  version: z.number(),
  tags: z.array(z.string().optional()).optional(),
  moderation: z
    .array(
      z.object({
        kind: z.literal('aws_rek'),
        status: z.enum(['approved', 'rejected'])
      })
    )
    .optional()
});

export const cloudinary_photo_validator = z.object({
  public_id: z.string(),
  version: z.number().optional(),
  aws_rek_status: z.enum(['approved', 'rejected', 'unknown']).optional(),
  alt_text: z.string().optional()
});

export type CloudinaryPhoto = z.infer<typeof cloudinary_photo_validator>;
