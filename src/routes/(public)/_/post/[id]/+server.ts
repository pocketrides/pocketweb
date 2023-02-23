import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCachedResponse, putCachedResponse } from '$lib/server/util/cache';
import { Post } from '$lib/server/db/Post';

export const GET = (async (event) => {
  let response = await getCachedResponse(event);

  if (!response) {
    const post = await Post.getById(event.params.id);

    if (post) {
      response = json(post);
      putCachedResponse(event, response, 'short');
    } else {
      response = json({}, { status: 404 });
    }
  }

  return response;
}) satisfies RequestHandler;
