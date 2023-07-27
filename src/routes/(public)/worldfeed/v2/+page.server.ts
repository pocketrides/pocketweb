import type { PageServerLoad } from './$types';

export const load = (async (event) => {
  const parent = await event.parent();

  return {
    ...parent
  };
}) satisfies PageServerLoad;
