import { Account } from '$lib/server/db/Account';
import { Nametag } from '$lib/server/db/Nametag';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { NametagListResponse } from '$lib/api/nametag/list';

export const GET = (async (event) => {
  let response: NametagListResponse = { success: false };

  const nametags = await Nametag.getByAccountRef(
    Account.toRef(event.locals.fauna_account_id as string)
  );

  if (nametags) {
    response = {
      success: true,
      nametags
    };
  }

  return json(response);
}) satisfies RequestHandler;
