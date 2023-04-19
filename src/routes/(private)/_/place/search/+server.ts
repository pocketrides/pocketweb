import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import type { PlaceSearchResponse } from '$lib/api/place/search';
import { GooglePlaceClient } from '$lib/server/db/GooglePlaceClient';

export const POST = (async (event) => {
  const payload = z
    .object({ query: z.string() })
    .safeParse(await event.request.json());

  let res: PlaceSearchResponse = { success: false, places: [] };

  if (payload.success) {
    res.success = true;
    res.places = await GooglePlaceClient.search(payload.data.query, event);
  }

  return json(res);
}) satisfies RequestHandler;
