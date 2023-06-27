import { json, type Handle, redirect, type RequestEvent } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { Fauna } from '$lib/server/db/Fauna';
import { Stytch } from '$lib/server/Stytch';
import { StripeClient } from '$lib/server/StripeClient';
import {
  createSessionCookie,
  destroySessionCookie,
  getSessionCookie
} from '$lib/server/cookies';
import { OpenAI } from '$lib/server/OpenAI';
import { MagicbellConfig } from '$lib/server/MagicbellConfig';
import { GooglePlaceClient } from '$lib/server/db/GooglePlaceClient';
// import * as Sentry from '@sentry/svelte';

export const handle = (async ({ event, resolve }) => {
  // Sentry.init({
  //   dsn: 'https://e3db4eb46baa4f43a32d1b98567638e4@o4504929428766720.ingest.sentry.io/4504929430274048',

  //   // Set tracesSampleRate to 1.0 to capture 100%
  //   // of transactions for performance monitoring.
  //   // We recommend adjusting this value in production
  //   tracesSampleRate: 0.5,
  //   denyUrls: ['10.0.0.16:5174']
  // });

  // Sentry.setTag('sveltekit', 'server');

  loadSecrets(
    event,
    event.platform && event.platform.env ? event.platform.env : env
  );

  const session_cookie = getSessionCookie(event.cookies);

  if (session_cookie) {
    const res = await Stytch.authenticate(session_cookie);

    if (res) {
      event.locals.fauna_account_id = res.fauna_account_id;
      event.locals.fauna_account = res.fauna_account;
      event.locals.nametag = res.nametag;
      event.locals.nametag_id = res.nametag_id;
      event.locals.room_key = res.room_key;
      event.locals.session_expires = res.session_expires;
      createSessionCookie(event.cookies, res.session_token);
    } else {
      destroySessionCookie(event.cookies);
    }
  }

  if (
    event.route.id?.startsWith('/(private)') &&
    event.locals.fauna_account_id === undefined
  ) {
    if (event.route.id?.startsWith('/(private)/_')) return json({ success: false });
    else throw redirect(302, `/error?back=`);
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
  STRIPE_PRICE_ID: string;
  MAGICBELL_KEY: string;
  MAGICBELL_SECRET: string;
  OPEN_AI_KEY: string;
  ROOM_HOST: string;
  MAGIC_NAMETAG_ID: string;
  MAGIC_POST_ID: string;
  GOOGLE_MAPS_API_KEY: string;
};

const loadSecrets = (event: RequestEvent, env: AppSecrets) => {
  // fauna
  Fauna.FAUNA_SECRET = env.FAUNA_SECRET;

  // stytch
  Stytch.SECRET = env.STYTCH_PROJECT_SECRET;
  Stytch.PROJECT_ID = env.STYTCH_PROJECT_ID;
  Stytch.ENV = env.STYTCH_ENV;

  // stripe
  StripeClient.STRIPE_KEY = env.STRIPE_KEY;
  StripeClient.STRIPE_SIGNING_SECRET = env.STRIPE_SIGNING_SECRET;
  StripeClient.STRIPE_PRICE_ID = env.STRIPE_PRICE_ID;

  // openai
  OpenAI.API_KEY = env.OPEN_AI_KEY;

  // magicbell
  MagicbellConfig.MAGICBELL_KEY = env.MAGICBELL_KEY;
  MagicbellConfig.MAGICBELL_SECRET = env.MAGICBELL_SECRET;

  // Room config (for frontend)
  event.locals.room_host = env.ROOM_HOST;

  // Auto-follow account
  event.locals.magic_nametag_id = env.MAGIC_NAMETAG_ID;

  // Homepage post ID
  event.locals.magic_post_id = env.MAGIC_POST_ID;

  GooglePlaceClient.GOOGLE_MAPS_API_KEY = env.GOOGLE_MAPS_API_KEY;
};
