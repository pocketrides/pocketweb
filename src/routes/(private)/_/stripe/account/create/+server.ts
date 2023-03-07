import { StripeClient } from '$lib/server/StripeClient';
import type { ApiGenericResponse } from '$lib/api/api';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST = (async (event) => {
  let res: ApiGenericResponse = { success: false };

  if (event.locals.nametag_id) {
    const id = await StripeClient.createAccount(
      event.locals.nametag_id,
      event.locals.nametag
    );

    if (id) res = { success: true };
  }

  return json(res);
}) satisfies RequestHandler;
