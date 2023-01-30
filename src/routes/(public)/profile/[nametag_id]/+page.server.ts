import { Nametag } from '$lib/server/db/Nametag';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { NametagStats } from '$lib/server/db/NametagStats';
import { blankNametagStats } from '$lib/zod/NametagStats';

export const load = (async (event) => {
  const nametag = await Nametag.getById(event.params.nametag_id);

  if (!nametag) throw error(404);

  const nametag_stats = await NametagStats.getByNametagRef(nametag.id);

  const parent = await event.parent();

  return {
    my_nametag: parent.my_nametag,
    page_theme: nametag.theme,
    page_nametag: nametag,
    page_nametag_stats: nametag_stats || blankNametagStats()
  };
}) satisfies PageServerLoad;
