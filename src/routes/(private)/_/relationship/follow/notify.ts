import type { FollowRequestPayload } from '$lib/api/relationships/follow';
import { Nametag } from '$lib/server/db/Nametag';
import type { RequestEvent } from '@sveltejs/kit';
import { Notification } from '@magicbell/core';

export const notify = async (payload: FollowRequestPayload, event: RequestEvent) => {
  const who_followed = await Nametag.getById(event.locals.nametag_id as string);

  if (who_followed)
    await Notification.create({
      title: `New follower`,
      content: `${who_followed.nametag} started following you!`,
      action_url: `https://${event.url.host}/profile/${who_followed.id}`,
      recipients: [{ external_id: payload.target_nametag_id }]
    });
};
