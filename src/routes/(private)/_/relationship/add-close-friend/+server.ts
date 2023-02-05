import {
  AddCloseFriendRequest,
  type AddCloseFriendRequestResponse
} from '$lib/api/relationships/add_close_friend';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Relationship } from '$lib/server/db/Relationship';

export const POST = (async (event) => {
  const payload = AddCloseFriendRequest.payload.safeParse(
    await event.request.json()
  );
  let response: AddCloseFriendRequestResponse = { success: false };

  if (payload.success && event.locals.nametag_id) {
    await Relationship.addToCloseFriends(
      event.locals.nametag_id,
      payload.data.target_nametag_id
    );

    response = { success: true };
  }

  return json(response);
}) satisfies RequestHandler;
