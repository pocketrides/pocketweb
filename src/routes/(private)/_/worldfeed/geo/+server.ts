import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
  WorldfeedGeoLookupRequest,
  type WorldfeedGeoLookupResponse
} from '$lib/api/worldfeed/geo';
import { GooglePlaceClient } from '$lib/server/db/GooglePlaceClient';

export const POST = (async (event) => {
  let res: WorldfeedGeoLookupResponse = { success: false };
  const payload = WorldfeedGeoLookupRequest.payload_validator.safeParse(
    await event.request.json()
  );

  if (payload.success && event.locals.nametag_id) {
    const result = await GooglePlaceClient.reverseGeocode(
      payload.data.latitude,
      payload.data.longitude
    );

    res = {
      success: result.city && result.state && result.country ? true : false,
      location: result
    };
  }

  return json(res);
}) satisfies RequestHandler;
