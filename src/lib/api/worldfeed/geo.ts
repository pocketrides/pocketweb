import { z } from 'zod';
import { Api } from '../api';
import { worldfeed_location_validator } from '$lib/zod/Worldfeed';

export class WorldfeedGeoLookupRequest {
  static endpoint = '/_/worldfeed/geo';

  static payload_validator = z.object({
    latitude: z.number(),
    longitude: z.number()
  });

  static response_validator = z.object({
    success: z.boolean(),
    location: worldfeed_location_validator.optional()
  });

  static async post(
    payload: WorldfeedGeoLookupPayload
  ): Promise<WorldfeedGeoLookupResponse> {
    const res = await Api.post<WorldfeedGeoLookupResponse>(
      this.endpoint,
      payload,
      this.response_validator
    );

    return {
      success: res.success,
      location: (res.success && res.location) || undefined
    };
  }
}

export type WorldfeedGeoLookupPayload = z.infer<
  typeof WorldfeedGeoLookupRequest.payload_validator
>;

export type WorldfeedGeoLookupResponse = z.infer<
  typeof WorldfeedGeoLookupRequest.response_validator
>;
