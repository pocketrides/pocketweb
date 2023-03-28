import { Nametag } from '$lib/server/db/Nametag';
import {
  FollowRequest,
  type FollowRequestResponse
} from '$lib/api/relationships/follow';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Relationship } from '$lib/server/db/Relationship';
import { Notify } from '$lib/server/Notify';

export const POST = (async (event) => {
  const payload = FollowRequest.payload.safeParse(await event.request.json());
  let response: FollowRequestResponse = { success: false };

  if (payload.success && event.locals.nametag_id) {
    await Relationship.follow(
      event.locals.nametag_id,
      payload.data.target_nametag_id
    );

    if (event.locals.nametag)
      await Notify({
        title: 'New follower',
        content: `${event.locals.nametag.nametag} started following you!`,
        action_url: `/profile/${event.locals.nametag.id}`,
        recipients: [{ external_id: payload.data.target_nametag_id }]
      });

    response = { success: true };
  }

  return json(response);
}) satisfies RequestHandler;
