import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
  const parent = await event.parent();

  if (!parent.my_membership || parent.pocket.settings.joinability === 'broadcast')
    throw redirect(302, `/pocket/${parent.pocket.id}`);

  return parent;
}) satisfies PageServerLoad;
