import {
  google_geocode_api_result_validator,
  google_place_api_result_validator,
  type GooglePlace
} from '$lib/zod/GooglePlace';
import type { WorldfeedLocation } from '$lib/zod/Worldfeed';
import type { RequestEvent } from '@sveltejs/kit';
import * as Sentry from '@sentry/svelte';

export class GooglePlaceClient {
  static GOOGLE_MAPS_API_KEY: string;

  static SERVICE_URL = `https://maps.googleapis.com/maps/api/place/textsearch/json`;
  static GEOCODE_URL = `https://maps.googleapis.com/maps/api/geocode/json`;

  static async search(query: string, event: RequestEvent): Promise<GooglePlace[]> {
    const qs = new URLSearchParams();

    qs.append('query', query);
    qs.append('radius', '25000');
    qs.append('type', 'establishment');
    qs.append('key', this.GOOGLE_MAPS_API_KEY);

    try {
      // @ts-ignore
      if (typeof event.request.cf !== 'undefined') {
        qs.append(
          'location',
          // @ts-ignore
          `${event.request.cf.latitude},${event.request.cf.longitude}`
        );
      }
    } catch (e) {
      Sentry.captureException(e);
    }

    const req = await fetch(`${this.SERVICE_URL}?${qs.toString()}`);
    const data = await req.json();
    const parsed = google_place_api_result_validator.safeParse(data);

    if (parsed.success && parsed.data.results) {
      return parsed.data.results || [];
    }

    return [];
  }

  static async reverseGeocode(lat: number, lng: number): Promise<WorldfeedLocation> {
    const qs = new URLSearchParams();
    qs.append('key', this.GOOGLE_MAPS_API_KEY);
    qs.append('latlng', `${lat},${lng}`);
    qs.append('result_type', 'locality|administrative_area_level_1');
    qs.append('location_type', 'APPROXIMATE');

    const req = await fetch(`${this.GEOCODE_URL}?${qs.toString()}`);
    const data = await req.json();
    const parsed = google_geocode_api_result_validator.safeParse(data);

    let state: string | undefined = undefined;
    let city: string | undefined = undefined;
    let country: string | undefined = undefined;

    if (parsed.success) {
      parsed.data.results?.forEach((r) => {
        r.address_components.forEach((c) => {
          if (c.types.includes('locality')) city = c.short_name;
          if (c.types.includes('administrative_area_level_1')) state = c.short_name;
          if (c.types.includes('country')) country = c.short_name;
        });
      });
    }

    return {
      enabled: true,
      state,
      city,
      country
    };
  }
}
