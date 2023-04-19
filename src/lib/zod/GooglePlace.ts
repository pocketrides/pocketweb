import { z } from 'zod';

export const google_place_validator = z.object({
  name: z.string().min(1).optional(),
  place_id: z.string().min(1).optional(),
  formatted_address: z.string().min(1).optional()
});

export const google_place_api_result_validator = z.object({
  results: google_place_validator.array().optional()
});

export type GooglePlace = z.infer<typeof google_place_validator>;
export type GooglePlaceApiResult = z.infer<typeof google_place_api_result_validator>;
