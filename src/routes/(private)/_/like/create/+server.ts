import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { like_post_payload_validator, type LikePostResponse } from '$lib/zod/Like';
import { Like } from '$lib/server/db/Like';

export const POST = (async (event) => {
  const payload = like_post_payload_validator.safeParse(await event.request.json());
  let response: LikePostResponse = { success: false, reason: 'idk' };

  if (payload.success && payload.data.post_id && event.locals.nametag_id) {
    response = await Like.likePost(event.locals.nametag_id, payload.data.post_id);
  }

  return json(response);
}) satisfies RequestHandler;
