import { z } from 'zod';

export const worldfeed_location_validator = z.object({
  enabled: z.boolean().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional()
});

export type WorldfeedLocation = z.infer<typeof worldfeed_location_validator>;
