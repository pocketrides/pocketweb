import { destroyNametagCookie, destroySessionCookie } from '$lib/server/Cookies';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async (event) => {
  destroyNametagCookie(event.cookies);
  destroySessionCookie(event.cookies);

  throw redirect(302, '/');
}) satisfies RequestHandler;
