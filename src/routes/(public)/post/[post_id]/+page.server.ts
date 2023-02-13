import { Like } from '$lib/server/db/Like';
import { Post } from '$lib/server/db/Post';
import { Quarantine } from '$lib/server/db/Quarantine';
import { Relationship } from '$lib/server/db/Relationship';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
  const post = await Post.getById(event.params.post_id);

  if (post === undefined) throw new Error();

  if (post.audience === 'close_friends') {
    if (event.locals.nametag_id) {
      const is_close_friend = await Relationship.isCloseFriend(
        post.nametag_ref.id,
        event.locals.nametag_id as string
      );

      if (!is_close_friend) throw new Error();
    } else throw new Error();
  }

  if (event.locals.nametag_id) {
    post.is_liked = await Like.doesLikePost(event.locals.nametag_id, post.id);
    post.is_quarantined = await Quarantine.doesQuarantinePost(
      event.locals.nametag_id,
      post.id
    );
  }

  const parent = await event.parent();

  return {
    post,
    my_nametag: parent.my_nametag,
    page_theme: post.nametag.theme
  };
}) satisfies PageServerLoad;
