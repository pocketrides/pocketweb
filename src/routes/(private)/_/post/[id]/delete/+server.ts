import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Post } from '$lib/server/db/Post';

export const DELETE = (async (event) => {
  if (!event.locals.nametag_id) return json({ success: false });

  return json({
    success: await Post.delete(event.params.id, event.locals.nametag_id)
  });
}) satisfies RequestHandler;
