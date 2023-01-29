import { z } from 'zod';

export const client_ref_validator = z.object({
  id: z.string()
});

export type ClientRef = z.infer<typeof client_ref_validator>;
