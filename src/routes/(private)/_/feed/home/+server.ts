import { Feed } from '$lib/server/db/Feed';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async (event) => {
  const feed = await Feed.getHomeFeed(event.locals.nametag_id as string);
  return json(feed);
}) satisfies RequestHandler;

export const POST = (async (event) => {
  const body = await event.request.json<{ after_id: string } | undefined>();

  const feed = await Feed.getHomeFeed(
    event.locals.nametag_id as string,
    body?.after_id
  );

  return json(feed);
}) satisfies RequestHandler;
