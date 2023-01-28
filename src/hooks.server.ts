import { destroyNametagCookie } from './lib/server/cookies';
import { json, type Handle, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { Fauna } from '$lib/server/db/Fauna';
import { Stytch } from '$lib/server/Stytch';
import {
  MAX_AGE_MINUTES,
  createNametagCookie,
  createSessionCookie,
  destroySessionCookie,
  getNametagCookie,
  getSessionCookie
} from '$lib/server/cookies';
import { Account } from '$lib/server/db/Account';
import { Nametag } from '$lib/server/db/Nametag';

export const handle = (async ({ event, resolve }) => {
  Fauna.FAUNA_SECRET = event.platform?.env.FAUNA_SECRET || env.FAUNA_SECRET;

  Stytch.SECRET =
    event.platform?.env.STYTCH_PROJECT_SECRET || env.STYTCH_PROJECT_SECRET;
  Stytch.PROJECT_ID = event.platform?.env.STYTCH_PROJECT_ID || env.STYTCH_PROJECT_ID;
  Stytch.ENV = event.platform?.env.STYTCH_ENV || env.STYTCH_ENV;

  const session_cookie = getSessionCookie(event.cookies);

  if (session_cookie) {
    const stytch_result = await Stytch.client().sessions.authenticate({
      session_token: session_cookie,
      session_duration_minutes: MAX_AGE_MINUTES
    });

    if (stytch_result.status_code === 200 && stytch_result.session_token) {
      createSessionCookie(event.cookies, stytch_result.session_token);
      const fauna_account = await Account.getByStytchId(stytch_result.user.user_id);

      if (fauna_account) {
        event.locals.fauna_account_id = fauna_account.id;

        const nametag_cookie = getNametagCookie(event.cookies);

        if (nametag_cookie) {
          const verified = await Nametag.verifyOwnership(
            event.locals.fauna_account_id,
            nametag_cookie
          );

          if (verified) {
            event.locals.nametag_id = verified.id;
            createNametagCookie(event.cookies, verified.id);
          } else {
            event.locals.nametag_id = undefined;
            destroyNametagCookie(event.cookies);
          }
        }
      } else {
        event.locals.fauna_account_id = undefined;
        destroySessionCookie(event.cookies);
      }
    } else {
      destroySessionCookie(event.cookies);
    }
  }

  if (
    event.route.id?.startsWith('(private)') &&
    event.locals.fauna_account_id === undefined
  ) {
    if (event.route.id.startsWith('(private)/_')) return json({ success: false });
    else throw redirect(301, '/');
  }

  return await resolve(event);
}) satisfies Handle;
