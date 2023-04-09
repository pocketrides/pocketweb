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
    if (
      pocket.nametag_ref.id === event.locals.nametag_id ||
      pocket.hosts.filter((h) => h.id === event.locals.nametag_id).length === 1
    ) {
      my_membership = {
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

  if (
    pocket.settings.joinability === 'moderated' &&
    my_membership?.status !== 'admin'
  ) {
    let redirect_url = `/pocket/${pocket.id}/pending`;
    let can_redirect = event.route.id !== '/(public)/pocket/[pocket_id]/pending';
    if (can_redirect) throw redirect(302, redirect_url);
  }

  return {
    pocket,
    my_membership
  };
}) satisfies LayoutServerLoad;
