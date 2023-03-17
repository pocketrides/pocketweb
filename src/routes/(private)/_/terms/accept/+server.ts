import type { ApiGenericResponse } from '$lib/api/api';
import { TermsAccept } from '$lib/api/terms/accept';
import { Account } from '$lib/server/db/Account';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createSessionCookie, getSessionCookie } from '$lib/server/Cookies';
import { Stytch } from '$lib/server/Stytch';

export const POST = (async (event) => {
  const payload = TermsAccept.payload.safeParse(await event.request.json());
  let result: ApiGenericResponse = { success: false };

  if (payload.success && event.locals.fauna_account_id) {
    const account = await Account.update(event.locals.fauna_account_id, {
      terms_version: payload.data.version
    });

    const session_cookie = getSessionCookie(event.cookies);

    if (account && session_cookie) {
      const upgrade = await Stytch.upgradeSessionWithAccount(
        session_cookie,
        account.id,
        account
      );

      if (upgrade) {
        createSessionCookie(event.cookies, upgrade.session_token);
        result = { success: true };
      }
    }
  }

  return json(result);
}) satisfies RequestHandler;
