import type { ApiGenericResponse } from '$lib/api/api';
import { TermsAccept } from '$lib/api/terms/accept';
import { Account } from '$lib/server/db/Account';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST = (async (event) => {
  const payload = TermsAccept.payload.safeParse(await event.request.json());
  let result: ApiGenericResponse = { success: false };

  if (payload.success && event.locals.fauna_account_id) {
    const account = await Account.update(event.locals.fauna_account_id, {
      terms_version: payload.data.version
    });

    if (account) result = { success: true };
  }

  return json(result);
}) satisfies RequestHandler;
