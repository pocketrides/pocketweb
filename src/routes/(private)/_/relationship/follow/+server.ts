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

    const who_followed = await Nametag.getById(event.locals.nametag_id);

    if (who_followed)
      await Notify(event, {
        title: 'New follower',
        content: `${who_followed.nametag} started following you!`,
        action_url: `https://${event.url.host}/profile/${who_followed.id}`,
        recipients: [{ external_id: payload.data.target_nametag_id }]
      });

    response = { success: true };
  }

  return json(response);
}) satisfies RequestHandler;
