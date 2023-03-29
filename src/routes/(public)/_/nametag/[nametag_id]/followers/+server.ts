import { Nametag } from '$lib/server/db/Nametag';
import { json } from '@sveltejs/kit';
import { getCachedResponse, putCachedResponse } from '$lib/server/util/cache';
import type { RequestHandler } from './$types';

export const GET = (async (event) => {
  let response = await getCachedResponse(event);

  if (!response) {
    response = json(await Nametag.getFollowers(event.params.nametag_id));

    putCachedResponse(event, response, 'short');
  }

  return response;
}) satisfies RequestHandler;
