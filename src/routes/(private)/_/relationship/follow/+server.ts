import {
  FollowRequest,
  type FollowRequestResponse
} from '$lib/api/relationships/follow';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Relationship } from '$lib/server/db/Relationship';

export const POST = (async (event) => {
  const payload = FollowRequest.payload.safeParse(await event.request.json());
  let response: FollowRequestResponse = { success: false };

  if (payload.success && event.locals.nametag_id) {
    await Relationship.follow(
      event.locals.nametag_id,
      payload.data.target_nametag_id
    );

    response = { success: true };
  }

  return json(response);
}) satisfies RequestHandler;
