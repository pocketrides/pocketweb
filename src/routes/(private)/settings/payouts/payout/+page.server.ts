import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { Payout } from '$lib/server/db/Payout';

export const load = (async (event) => {
  const parent = await event.parent();

  if (!parent.can_create_payouts) throw redirect(302, '/settings/payouts');

  let payout;

  if (event.locals.nametag_id)
    payout = await Payout.createOrContinue(event.locals.nametag_id);

  if (!payout) throw error(403);

  return {
    my_nametag: parent.my_nametag,
    page_theme: parent.my_nametag?.theme,
    payout
  };
}) satisfies PageServerLoad;

export const actions = {
  start: async (event) => {
    const fd = await event.request.formData();
    const payout_id = fd.get('payout_id')?.toString();

    if (!payout_id) return false;

    if (event.locals.nametag_id) {
      await Payout.updateStatus(
        event,
        payout_id,
        event.locals.nametag_id,
        'processing'
      );
      return true;
    }
  },
  transfer: async (event) => {
    const fd = await event.request.formData();
    const payout_id = fd.get('payout_id')?.toString();

    if (!payout_id) return false;

    if (event.locals.nametag_id) {
      await Payout.updateStatus(
        event,
        payout_id,
        event.locals.nametag_id,
        'transferred'
      );

      return true;
    }
  }
} satisfies Actions;
