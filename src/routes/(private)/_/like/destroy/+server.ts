import { Like } from '$lib/server/db/Like';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { LikeDestroyRequest, type LikeDestroyResponse } from '$lib/api/like/destroy';
import type { DraftLike } from '$lib/zod/Like';

export const POST = (async (event) => {
  const payload = LikeDestroyRequest.payload.safeParse(await event.request.json());
  let res: LikeDestroyResponse = { success: false };

  if (payload.success && event.locals.nametag_id) {
    const draft: DraftLike = Object.assign(payload.data, {
      nametag_id: event.locals.nametag_id
    });

    res = {
      success: await Like.unassign(draft)
    };
  }

  return json(res);
}) satisfies RequestHandler;
