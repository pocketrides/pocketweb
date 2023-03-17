import { StytchVerify, type StytchVerifyResponse } from '$lib/api/stytch/verify';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Stytch } from '$lib/server/Stytch';
import { MAX_AGE_MINUTES, createSessionCookie } from '$lib/server/Cookies';
import { Account } from '$lib/server/db/Account';

export const POST = (async (event) => {
  const payload = StytchVerify.payload.safeParse(await event.request.json());
  let response: StytchVerifyResponse = { success: false };

  if (payload.success) {
    try {
      const stytch_response = await Stytch.client().otps.authenticate({
        method_id: payload.data.method_id,
        code: payload.data.code,
        session_duration_minutes: MAX_AGE_MINUTES
      });

      if (
        stytch_response.status_code === 200 &&
        stytch_response.user &&
        stytch_response.session_token &&
        stytch_response.session_jwt
      ) {
        const fauna_account = await Account.createIfNeeded(
          stytch_response.user.user_id
        );

        if (fauna_account) {
          const upgrade = await Stytch.upgradeSessionWithAccount(
            stytch_response.session_token,
            fauna_account.id,
            fauna_account
          );

          if (upgrade) {
            createSessionCookie(event.cookies, upgrade.session_token);

            response = {
              success: true
            };
          } else throw new Error(`couldn't upgrade account`);
        } else throw new Error(`couldn't make fauna account`);
      } else throw new Error('bad stytch response', { cause: stytch_response });
    } catch (e) {
      console.error('> verify/server', e);
    }
  }

  return json(response);
}) satisfies RequestHandler;
