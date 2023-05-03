import { NametagStats } from '$lib/server/db/NametagStats';
import { Relationship } from '$lib/server/db/Relationship';
import { blankNametagStats } from '$lib/zod/NametagStats';
import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { createSessionCookie, getSessionCookie } from '$lib/server/cookies';
import { Stytch } from '$lib/server/Stytch';
import { Nametag } from '$lib/server/db/Nametag';

export const load = (async (event) => {
  if (event.url.searchParams.has('subscribed') && event.locals.nametag_id) {
    const nametag = await Nametag.getById(event.locals.nametag_id);

    if (nametag) {
      const session_cookie = getSessionCookie(event.cookies);

      if (session_cookie) {
        const upgrade = await Stytch.upgradeSessionWithNametag(
          session_cookie,
          nametag.id,
          nametag
        );

        if (upgrade && upgrade.nametag_id === nametag.id) {
          createSessionCookie(event.cookies, upgrade.session_token);
          throw redirect(302, `/profile/${nametag.id}`);
        }
      }
    }
  }

  const page_nametag = await Nametag.getClientNametagById(event.params.nametag_id);

  if (!page_nametag) throw error(404);

  const parent = await event.parent();

  if (
    parent.my_nametag &&
    (await Relationship.isBlocking(page_nametag.id, parent.my_nametag.id))
  )
    throw error(404);

  const is_my_profile_page = event.locals.nametag_id === page_nametag.id;

  const page_nametag_stats = await NametagStats.getByNametagRef(page_nametag.id);

  const relationship = {
    is_following: false,
    is_blocking: false,
    is_close_friend: false
  };

  if (parent.my_nametag && !is_my_profile_page) {
    relationship.is_following = await Relationship.isFollowing(
      parent.my_nametag.id,
      page_nametag.id
    );

    relationship.is_close_friend = await Relationship.isCloseFriend(
      parent.my_nametag.id,
      page_nametag.id
    );

    relationship.is_blocking = await Relationship.isBlocking(
      parent.my_nametag.id,
      page_nametag.id
    );
  }

  return {
    my_nametag: parent.my_nametag,
    room_key: parent.room_key,
    is_my_profile_page,
    page_theme: page_nametag.theme,
    page_nametag: page_nametag,
    page_nametag_stats: page_nametag_stats || blankNametagStats(),
    relationship,
    nametag_id: page_nametag.id
  };
}) satisfies LayoutServerLoad;
