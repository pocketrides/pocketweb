import { NametagUpdate, type NametagUpdateResponse } from '$lib/api/nametag/update';
import { Nametag } from '$lib/server/db/Nametag';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createSessionCookie, getSessionCookie } from '$lib/server/cookies';
import { Stytch } from '$lib/server/Stytch';

export const POST = (async (event) => {
  const payload = NametagUpdate.payload.safeParse(await event.request.json());
  let response: NametagUpdateResponse = { success: false };

  if (event.locals.nametag_id && payload.success) {
    const nametag = await Nametag.update(event.locals.nametag_id, payload.data);

    if (nametag) {
      const session_cookie = getSessionCookie(event.cookies);

      if (session_cookie) {
        const upgrade = await Stytch.upgradeSessionWithNametag(
          session_cookie,
          nametag.id,
          nametag
        );

        if (upgrade && upgrade.nametag_id === nametag.id) {
          createSessionCookie(event.cookies, upgrade.session_token);
          response = { success: true };
        }
      }
    }
  }

  return json(response);
}) satisfies RequestHandler;
