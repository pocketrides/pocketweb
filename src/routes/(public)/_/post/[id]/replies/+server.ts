import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { RetrieveRepliesRequestResponse } from '$lib/api/reply/retrieve';
import { getCachedResponse, putCachedResponse } from '$lib/server/util/cache';
import { Reply } from '$lib/server/db/Reply';

export const GET = (async (event) => {
  let response = await getCachedResponse(event);

  if (!response) {
    const post_id = event.params.id;

    let res: RetrieveRepliesRequestResponse = {
      replies: await Reply.retrieve(post_id, event.locals.nametag_id)
    };

    response = json(res);

    putCachedResponse(event, response, 'short');
  }

  return response;
}) satisfies RequestHandler;
