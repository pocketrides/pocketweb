import { z } from 'zod';
import { Api } from '../api';
import { google_place_validator } from '$lib/zod/GooglePlace';

export class PlaceSearchRequest {
  static endpoint = '/_/place/search';

  static validator = z.object({
    success: z.boolean(),
    places: z.array(google_place_validator)
  });

  static async search(query: string) {
    return await Api.post<PlaceSearchResponse>(
      this.endpoint,
      { query },
      this.validator
    );
  }
}

export type PlaceSearchResponse = z.infer<typeof PlaceSearchRequest.validator>;
