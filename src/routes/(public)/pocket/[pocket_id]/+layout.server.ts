import { Pocket } from '$lib/server/db/Pocket';
import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { PocketMember } from '$lib/server/db/PocketMember';
import type { ClientPocketMember } from '$lib/zod/PocketMember';

export const load = (async (event) => {
  const pocket = await Pocket.retrieve(event.params.pocket_id);

  if (!pocket) throw error(404);

  let my_membership: ClientPocketMember | undefined = undefined;

  if (event.locals.nametag_id && event.locals.nametag) {
    if (Pocket.isPocketAdmin(event.locals.nametag_id, pocket)) {
      my_membership = {
        id: '',
        ts: 0,
        pocket_ref: { id: event.params.pocket_id },
        nametag_ref: { id: event.locals.nametag_id },
        nametag: event.locals.nametag,
        status: 'admin',
        settings: {
          enable_notifications: true
        }
      };
    } else {
      my_membership = await PocketMember.getMember(
        event.params.pocket_id,
        event.locals.nametag_id
      );

      if (my_membership) {
        if (my_membership.status === 'banned') {
          throw error(404);
        }
      }
    }
  }

  if (pocket.settings.joinability === 'moderated') {
    if (
      typeof my_membership === 'undefined' ||
      my_membership?.status === 'pending'
    ) {
      let redirect_url = `/pocket/${pocket.id}/pending`;
      let can_redirect = event.route.id !== '/(public)/pocket/[pocket_id]/pending';
      if (can_redirect) throw redirect(302, redirect_url);
    }
  }

  return {
    pocket,
    my_membership,
    page_theme: pocket.theme,
    page_fill: 'dark'
  };
}) satisfies LayoutServerLoad;
