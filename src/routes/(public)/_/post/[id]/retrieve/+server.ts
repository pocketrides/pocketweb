import { getCachedResponse, putCachedResponse } from '$lib/server/util/cache';
import { json } from '@sveltejs/kit';
import { Post } from '$lib/server/db/Post';
import type { RequestHandler } from './$types';

export const GET = (async (event) => {
  let response = await getCachedResponse(event);

  if (!response) {
    const res = await Post.retrieve(
      event.params.id,
      event.locals.nametag_id || null
    );
    response = json(res);

    putCachedResponse(event, response, 'short');
  }

  return response;
}) satisfies RequestHandler;
