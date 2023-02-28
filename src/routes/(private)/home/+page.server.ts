import type { PageServerLoad } from './$types';

export const load = (async (event) => {
  const parent = await event.parent();

  return {
    my_nametag: parent.my_nametag,
    page_theme: parent.my_nametag?.theme
  };
}) satisfies PageServerLoad;
