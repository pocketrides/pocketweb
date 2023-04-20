import { z } from 'zod';

export const google_place_validator = z.object({
  name: z.string().min(1).optional(),
  place_id: z.string().min(1).optional(),
  formatted_address: z.string().min(1).optional()
});

export const google_geocode_validator = z.object({
  address_components: z.array(
    z.object({
      long_name: z.string(),
      short_name: z.string(),
      types: z.string().array()
    })
  )
});

export const google_place_api_result_validator = z.object({
  results: google_place_validator.array().optional()
});

export const google_geocode_api_result_validator = z.object({
  results: google_geocode_validator.array().optional()
});

export type GooglePlace = z.infer<typeof google_place_validator>;
export type GooglePlaceApiResult = z.infer<typeof google_place_api_result_validator>;
