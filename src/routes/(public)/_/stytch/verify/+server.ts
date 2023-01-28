import { StytchVerify, type StytchVerifyResponse } from '$lib/api/stytch/verify';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Stytch } from '$lib/server/Stytch';
import { MAX_AGE_MINUTES, createSessionCookie } from '$lib/server/cookies';
import { Account } from '$lib/server/db/Account';

export const POST = (async (event) => {
  const payload = StytchVerify.payload.safeParse(await event.request.json());
  let response: StytchVerifyResponse = { success: false };

  if (payload.success) {
    const stytch_response = await Stytch.client().otps.authenticate({
      method_id: payload.data.method_id,
      code: payload.data.code,
      session_duration_minutes: MAX_AGE_MINUTES
    });

    if (
      stytch_response.status_code === 200 &&
      stytch_response.user &&
      stytch_response.session_token
    ) {
      const fauna_account_id = await Account.createIfNeeded(
        stytch_response.user.user_id
      );

      event.locals.fauna_account_id = fauna_account_id;

      if (fauna_account_id) {
        createSessionCookie(event.cookies, stytch_response.session_token);
      }

      response = {
        success: fauna_account_id !== undefined
      };
    }
  }

  return json(response);
}) satisfies RequestHandler;
