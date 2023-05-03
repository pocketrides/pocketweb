import { NametagUse, type NametagUseResponse } from '$lib/api/nametag/use';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createSessionCookie, getSessionCookie } from '$lib/server/cookies';
import { Nametag } from '$lib/server/db/Nametag';
import { Stytch } from '$lib/server/Stytch';

export const POST = (async (event) => {
  const payload = NametagUse.payload.safeParse(await event.request.json());
  let response: NametagUseResponse = { success: false };

  if (event.locals.fauna_account_id && payload.success) {
    const verified_owner = await Nametag.verifyOwnership(
      event.locals.fauna_account_id,
      payload.data.nametag_id
    );

    if (verified_owner) {
      // event.locals.nametag_id = payload.data.nametag_id;
      // createNametagCookie(event.cookies, payload.data.nametag_id);
      // response = { success: true };

      const session_cookie = getSessionCookie(event.cookies);

      if (session_cookie) {
        const upgrade = await Stytch.upgradeSessionWithNametag(
          session_cookie,
          verified_owner.id,
          verified_owner
        );

        if (upgrade && upgrade.nametag_id === verified_owner.id) {
          createSessionCookie(event.cookies, upgrade.session_token);
          response = { success: true };
        }
      }
    }
  }

  return json(response);
}) satisfies RequestHandler;
