import { z } from 'zod';

export const cloudinary_photo_validator = z.object({
  public_id: z.string(),
  version: z.number().optional(),
  aws_rek_status: z.enum(['approved', 'rejected', 'unknown']).optional(),
  alt_text: z.string().optional()
});

export type CloudinaryPhoto = z.infer<typeof cloudinary_photo_validator>;
