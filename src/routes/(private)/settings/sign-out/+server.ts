import { destroySessionCookie } from '$lib/server/cookies';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async (event) => {
  destroySessionCookie(event.cookies);

  throw redirect(302, '/');
}) satisfies RequestHandler;
