import { Stytch } from '$lib/server/Stytch';
import { NametagCollab } from '$lib/server/db/NametagCollab';
import { json } from '@sveltejs/kit';
import type { ApiGenericResponse } from '$lib/api/api';
import type { RequestHandler } from './$types';
import { NametagCollabRemoveRequest } from '$lib/api/nametag/collab/remove';
import { Notify } from '$lib/server/Notify';
import { destroySessionCookie } from '$lib/server/Cookies';

export const POST = (async (event) => {
  let response: {
    success: boolean;
    removed_account_id?: string | null;
    needs_reload?: boolean;
  } = {
    success: false
  };
  const payload = NametagCollabRemoveRequest.payload.safeParse(
    await event.request.json()
  );

  if (payload.success && event.locals.nametag_id) {
    response = await NametagCollab.remove(
      event.locals.nametag_id,
      payload.data.authorized_nametag_id
    );

    if (response.success && response.removed_account_id) {
      if (response.removed_account_id === event.locals.fauna_account_id) {
        response.needs_reload = true;
        destroySessionCookie(event.cookies);
      }
    }

    if (response.success) {
      await Notify({
        title: `Removed from Nametag`,
        content: `${event.locals.nametag?.nametag} removed you as a collaborator.`,
        recipients: [{ external_id: payload.data.authorized_nametag_id }]
      });
    }
  }

  return json(response);
}) satisfies RequestHandler;
