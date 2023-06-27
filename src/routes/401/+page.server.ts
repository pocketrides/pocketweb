import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const allowed_redirects = ['/settings'];

export const load = (async (event) => {
  const param = event.url.searchParams.get('p');
  if (!param) throw redirect(302, '/');

  const idx = allowed_redirects.indexOf(param);
  if (idx === -1) throw redirect(302, '/');

  return {
    redirect: allowed_redirects[idx]
  };
}) satisfies PageServerLoad;
