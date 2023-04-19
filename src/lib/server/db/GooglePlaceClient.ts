import {
  google_place_api_result_validator,
  type GooglePlace
} from '$lib/zod/GooglePlace';
import type { RequestEvent } from '@sveltejs/kit';

export class GooglePlaceClient {
  static GOOGLE_MAPS_API_KEY: string;

  static SERVICE_URL = `https://maps.googleapis.com/maps/api/place/textsearch/json`;

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
    } catch (e) {}

    const req = await fetch(`${this.SERVICE_URL}?${qs.toString()}`);
    const data = await req.json();
    const parsed = google_place_api_result_validator.safeParse(data);

    if (parsed.success && parsed.data.results) {
      return parsed.data.results || [];
    }

    return [];
  }
}
