import { z } from 'zod';

export const link_validator = z.object({
  url: z.string(),
  og_image: z.string().optional(),
  og_title: z.string().optional(),
  og_desc: z.string().optional(),
  blocked: z.string().optional()
});

export type Link = z.infer<typeof link_validator>;
