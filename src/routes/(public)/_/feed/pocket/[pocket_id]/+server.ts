import { Feed } from '$lib/server/db/Feed';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCachedResponse, putCachedResponse } from '$lib/server/util/cache';

export const GET = (async (event) => {
  let response = await getCachedResponse(event);

  if (!response) {
    const feed = await Feed.getPocketFeed(event.params.pocket_id);
    response = json(feed);

    putCachedResponse(event, response, 'short');
  }
  return response;
}) satisfies RequestHandler;

export const POST = (async (event) => {
  const body = await event.request.json<{ after_id: string } | undefined>();

  const feed = await Feed.getPocketFeed(event.params.pocket_id, body?.after_id);

  return json(feed);
}) satisfies RequestHandler;
