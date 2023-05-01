import { json } from '@sveltejs/kit';
import { Post } from '$lib/server/db/Post';
import type { RequestHandler } from './$types';

export const GET = (async (event) => {
  const res = await Post.retrieve(event.params.id, event.locals.nametag_id || null);

  return json(res);
}) satisfies RequestHandler;
