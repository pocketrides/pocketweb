import { z } from 'zod';

export const server_terms_validator = z.object({
  id: z.string(),
  version: z.string(),
  summary: z.string(),
  text: z.string()
});

export type ServerTerms = z.infer<typeof server_terms_validator>;
