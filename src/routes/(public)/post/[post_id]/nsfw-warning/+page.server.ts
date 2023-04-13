import type { PageServerLoad } from './$types';

export const load = (async (event) => {
  const parent = await event.parent();

  return {
    ...parent,
    post_id: event.params.post_id
  };
}) satisfies PageServerLoad;
