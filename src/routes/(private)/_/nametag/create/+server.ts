import { NametagCreate, type NametagCreateResponse } from '$lib/api/nametag/create';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Nametag } from '$lib/server/db/Nametag';
import { createSessionCookie, getSessionCookie } from '$lib/server/Cookies';
import { Stytch } from '$lib/server/Stytch';

export const POST = (async (event) => {
  const payload = NametagCreate.payload.safeParse(await event.request.json());
  let response: NametagCreateResponse = { success: false };

  if (event.locals.fauna_account_id && payload.success) {
    const nametag = await Nametag.create(
      event.locals.fauna_account_id,
      payload.data
    );

    if (nametag) {
      const session_cookie = getSessionCookie(event.cookies);

      if (session_cookie) {
        const upgrade = await Stytch.upgradeSessionWithNametag(
          session_cookie,
          nametag.id,
          nametag
        );

        if (upgrade && upgrade.nametag_id) {
          createSessionCookie(event.cookies, upgrade.session_token);
          response = { success: true, nametag_id: upgrade.nametag_id };
        }
      }
    }
  }

  return json(response);
}) satisfies RequestHandler;
