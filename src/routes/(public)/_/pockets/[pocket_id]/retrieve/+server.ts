import { getCachedResponse, putCachedResponse } from '$lib/server/util/cache';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Pocket } from '$lib/server/db/Pocket';

export const GET = (async (event) => {
  let response = await getCachedResponse(event);

  if (!response) {
    const pocket = await Pocket.retrieve(event.params.pocket_id);

    response = json({
      success: typeof pocket !== 'undefined',
      pocket
    });

    if (pocket) putCachedResponse(event, response, 'short');
  }

  return response;
}) satisfies RequestHandler;
