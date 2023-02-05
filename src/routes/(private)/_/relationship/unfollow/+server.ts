import {
  UnfollowRequest,
  type UnfollowRequestResponse
} from '$lib/api/relationships/unfollow';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Relationship } from '$lib/server/db/Relationship';

export const POST = (async (event) => {
  const payload = UnfollowRequest.payload.safeParse(await event.request.json());
  let response: UnfollowRequestResponse = { success: false };

  if (payload.success && event.locals.nametag_id) {
    await Relationship.unfollow(
      event.locals.nametag_id,
      payload.data.target_nametag_id
    );

    response = { success: true };
  }

  return json(response);
}) satisfies RequestHandler;
