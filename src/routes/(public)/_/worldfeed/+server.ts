import { Worldfeed } from '$lib/server/db/Worldfeed';
import { getCachedResponse, putCachedResponse } from '$lib/server/util/cache';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async (event) => {
  let response = await getCachedResponse(event);

  if (!response) {
    const worldfeed = await Worldfeed.list(
      event.url.searchParams.get('c') || undefined,
      event.url.searchParams.get('s') || undefined,
      event.url.searchParams.get('i') || undefined
    );

    response = json(worldfeed);

    putCachedResponse(event, response, 'long');
  }

  return response;
}) satisfies RequestHandler;
