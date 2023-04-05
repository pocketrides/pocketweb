import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
  const parent = await event.parent();

  if (!parent.my_nametag) throw redirect(302, '/');

  return {
    my_nametag: parent.my_nametag,
    page_theme: parent.my_nametag.theme
  };
};
