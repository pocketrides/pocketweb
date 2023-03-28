import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
  if (event.locals.fauna_account_id && event.locals.nametag_id) {
    throw redirect(302, '/home');
  }

  throw redirect(302, '/post/360300421885984845');
}) satisfies PageServerLoad;
