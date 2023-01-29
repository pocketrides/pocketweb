import { NametagUse, type NametagUseResponse } from '$lib/api/nametag/use';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createNametagCookie } from '$lib/server/Cookies';
import { Nametag } from '$lib/server/db/Nametag';

export const POST = (async (event) => {
  const payload = NametagUse.payload.safeParse(await event.request.json());
  let response: NametagUseResponse = { success: false };

  if (payload.success) {
    const verified_owner = await Nametag.verifyOwnership(
      event.locals.fauna_account_id as string,
      payload.data.nametag_id
    );

    if (verified_owner) {
      event.locals.nametag_id = payload.data.nametag_id;
      createNametagCookie(event.cookies, payload.data.nametag_id);
      response = { success: true };
    }
  }

  return json(response);
}) satisfies RequestHandler;
