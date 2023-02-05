import { json, type Handle, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { Fauna } from '$lib/server/db/Fauna';
import { Stytch } from '$lib/server/Stytch';
import { StripeClient } from '$lib/server/StripeClient';
import {
  MAX_AGE_MINUTES,
  createNametagCookie,
  destroyNametagCookie,
  createSessionCookie,
  destroySessionCookie,
  getNametagCookie,
  getSessionCookie
} from '$lib/server/Cookies';
import { Account } from '$lib/server/db/Account';
import { Nametag } from '$lib/server/db/Nametag';
import { MagicBellClient } from '$lib/server/MagicBellClient';

export const handle = (async ({ event, resolve }) => {
  loadSecrets(event.platform && event.platform.env ? event.platform.env : env);

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
            destroySessionCookie(event.cookies);
            destroyNametagCookie(event.cookies);
          }
        }
      } else {
        event.locals.fauna_account_id = undefined;
        destroySessionCookie(event.cookies);
      }
    } else {
      destroySessionCookie(event.cookies);
      destroyNametagCookie(event.cookies);
    }
  } else {
    destroySessionCookie(event.cookies);
    destroyNametagCookie(event.cookies);
  }

  if (
    event.route.id?.startsWith('/(private)') &&
    event.locals.fauna_account_id === undefined
  ) {
    if (event.route.id?.startsWith('/(private)/_')) return json({ success: false });
    else throw redirect(301, '/');
  }

  return await resolve(event);
}) satisfies Handle;

type AppSecrets = {
  FAUNA_SECRET: string;
  STYTCH_PROJECT_ID: string;
  STYTCH_PROJECT_SECRET: string;
  STYTCH_ENV: string;
  STRIPE_KEY: string;
  STRIPE_SIGNING_SECRET: string;
  MAGICBELL_KEY: string;
  MAGICBELL_SECRET: string;
};

const loadSecrets = (env: AppSecrets) => {
  Fauna.FAUNA_SECRET = env.FAUNA_SECRET;

  Stytch.SECRET = env.STYTCH_PROJECT_SECRET;
  Stytch.PROJECT_ID = env.STYTCH_PROJECT_ID;
  Stytch.ENV = env.STYTCH_ENV;

  StripeClient.STRIPE_KEY = env.STRIPE_KEY;
  StripeClient.STRIPE_SIGNING_SECRET = env.STRIPE_SIGNING_SECRET;

  MagicBellClient.API_KEY = env.MAGICBELL_KEY;
  MagicBellClient.API_SECRET = env.MAGICBELL_SECRET;
};
