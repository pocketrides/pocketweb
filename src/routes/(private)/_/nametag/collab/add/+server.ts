import { NametagCollab } from '$lib/server/db/NametagCollab';
import type { ApiGenericResponse } from '$lib/api/api';
import { NametagCollabAddRequest } from '$lib/api/nametag/collab/add';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Notify } from '$lib/server/Notify';

export const POST = (async (event) => {
  let response: ApiGenericResponse = { success: false };
  const payload = NametagCollabAddRequest.payload.safeParse(
    await event.request.json()
  );

  if (payload.success && event.locals.nametag_id) {
    response = await NametagCollab.add(
      event.locals.nametag_id,
      payload.data.authorized_nametag_id
    );

    if (response.success) {
      await Notify({
        title: `Added to Nametag`,
        content: `${event.locals.nametag?.nametag} added you as a collaborator! Next time you sign in, you'll be able to post as them.`,
        action_url: `/profile/${event.locals.nametag_id}`,
        recipients: [{ external_id: payload.data.authorized_nametag_id }]
      });

      await Notify({
        title: `Added to Collab`,
        content: `You added a new collaborator. Tap to review.`,
        action_url: `/settings?s=collab`,
        recipients: [{ external_id: event.locals.nametag_id }]
      });
    }
  }

  return json(response);
}) satisfies RequestHandler;
