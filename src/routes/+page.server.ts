import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
  if (event.locals.fauna_account_id && event.locals.nametag_id) {
    throw redirect(301, '/home');
  }
}) satisfies PageServerLoad;
