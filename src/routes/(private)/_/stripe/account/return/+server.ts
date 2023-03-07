import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async (event) => {
  if (event.locals.nametag_id)
    throw redirect(302, `/profile/${event.locals.nametag_id}`);

  throw redirect(302, '/settings');
}) satisfies RequestHandler;
