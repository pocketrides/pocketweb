import {
  RemoveCloseFriendRequest,
  type RemoveCloseFriendRequestResponse
} from '$lib/api/relationships/remove_close_friend';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Relationship } from '$lib/server/db/Relationship';

export const POST = (async (event) => {
  const payload = RemoveCloseFriendRequest.payload.safeParse(
    await event.request.json()
  );
  let response: RemoveCloseFriendRequestResponse = { success: false };

  if (payload.success && event.locals.nametag_id) {
    await Relationship.removeFromCloseFriends(
      event.locals.nametag_id,
      payload.data.target_nametag_id
    );

    response = { success: true };
  }

  return json(response);
}) satisfies RequestHandler;
