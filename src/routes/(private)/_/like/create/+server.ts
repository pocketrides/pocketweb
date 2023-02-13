import { LikeCreateRequest, type LikeCreateResponse } from '$lib/api/like/create';
import { Like } from '$lib/server/db/Like';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { DraftLike } from '$lib/zod/Like';

export const POST = (async (event) => {
  const payload = LikeCreateRequest.payload.safeParse(await event.request.json());
  let res: LikeCreateResponse = { success: false };

  if (payload.success && event.locals.fauna_account_id && event.locals.nametag_id) {
    const draft: DraftLike = Object.assign(payload.data, {
      nametag_id: event.locals.nametag_id
    });

    res = {
      success: await Like.assign(event.locals.fauna_account_id, draft)
    };
  }

  return json(res);
}) satisfies RequestHandler;
