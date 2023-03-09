import { NametagStats } from '$lib/server/db/NametagStats';
import type { LayoutServerLoad } from './$types';

export const load = (async (event) => {
  let payouts_enabled = false;
  let total_likes = undefined;

  if (event.locals.nametag?.stats_ref?.id) {
    const stats = await NametagStats.get(event.locals.nametag.stats_ref.id);
    if (stats) {
      payouts_enabled = (stats.likes_received || 0) >= 500;
      total_likes = stats.likes_received;
    }
  }
  return {
    payouts_enabled,
    total_likes
  };
}) satisfies LayoutServerLoad;
