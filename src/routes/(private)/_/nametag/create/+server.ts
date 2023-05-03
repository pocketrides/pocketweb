import { NametagCreate, type NametagCreateResponse } from '$lib/api/nametag/create';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Nametag } from '$lib/server/db/Nametag';
import { createSessionCookie, getSessionCookie } from '$lib/server/cookies';
import { Stytch } from '$lib/server/Stytch';
import { TopicSubscribe } from '$lib/server/Notify';
import { Relationship } from '$lib/server/db/Relationship';

export const POST = (async (event) => {
  const payload = NametagCreate.payload.safeParse(await event.request.json());
  let response: NametagCreateResponse = { success: false };

  if (event.locals.fauna_account_id && payload.success) {
    const nametag = await Nametag.create(
      event.locals.fauna_account_id,
      payload.data
    );

    if (nametag) {
      try {
        await TopicSubscribe(nametag.id, 'announcements');
        await Relationship.follow(nametag.id, event.locals.magic_nametag_id);
      } catch (e) {
        console.error('nametag.create api route:', e);
      }

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
