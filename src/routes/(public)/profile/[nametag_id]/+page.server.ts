import { Feed } from '$lib/server/db/Feed';
import { Nametag } from '$lib/server/db/Nametag';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { NametagStats } from '$lib/server/db/NametagStats';
import { blankNametagStats } from '$lib/zod/NametagStats';
import { Relationship } from '$lib/server/db/Relationship';

export const load = (async (event) => {
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

  const feed = await Feed.getNametagFeed(page_nametag.id);

  return {
    my_nametag: parent.my_nametag,
    room_key: parent.room_key,
    is_my_profile_page,
    page_theme: page_nametag.theme,
    page_nametag: page_nametag,
    page_nametag_stats: page_nametag_stats || blankNametagStats(),
    relationship,
    nametag_id: page_nametag.id,
    post_ids: feed.post_ids,
    after_id: feed.after_id,
    has_more: feed.has_more
  };
}) satisfies PageServerLoad;
