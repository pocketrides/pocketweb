import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
  if (event.locals.fauna_account_id && event.locals.nametag_id) {
    throw redirect(302, '/home');
  }

  throw redirect(302, `/post/${event.locals.magic_post_id}`);
}) satisfies PageServerLoad;
