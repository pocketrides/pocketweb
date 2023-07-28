import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Pocket } from '$lib/server/db/Pocket';
import { PocketMember } from '$lib/server/db/PocketMember';
import type { ServerPocket } from '$lib/zod/Pocket';
import type { DraftPost } from '$lib/zod/Post';
import { Post } from '$lib/server/db/Post';

export const load = (async (event) => {
  const parent = await event.parent();

  const has_pocket_id = event.url.searchParams.has('pocket');
  const has_edit_id = event.url.searchParams.has('edit');

  if (
    !parent.my_nametag ||
    (parent.my_nametag?.stripe?.has_sub !== true && has_pocket_id === false)
  ) {
    throw redirect(302, '/');
  }

  let post: DraftPost | undefined;
  let edit_id: string | undefined;

  if (has_edit_id && event.locals.nametag_id) {
    edit_id = event.url.searchParams.get('edit')!.toString();

    post = await Post.retrieveToEdit(edit_id, event.locals.nametag_id);

    if (!post) {
      throw redirect(302, '/');
    }
  }

  let pocket: ServerPocket | undefined;

  if (has_pocket_id) {
    pocket = await Pocket.retrieve(event.url.searchParams.get('pocket')!.toString());

    if (!pocket) {
      throw redirect(302, '/');
    }

    const is_admin = Pocket.isPocketAdmin(parent.my_nametag.id, pocket);

    if (is_admin === false) {
      const membership = await PocketMember.getMember(
        pocket.id,
        parent.my_nametag.id
      );

      if (!membership || membership.status !== 'joined') {
        throw redirect(302, `/pocket/${pocket.id}`);
      }
    }
  }

  let all_pockets = await Pocket.list(parent.my_nametag.id, true, true);

  return {
    my_nametag: parent.my_nametag,
    page_theme: parent.my_nametag?.theme,
    pocket,
    edit_id,
    post,
    all_pockets
  };
}) satisfies PageServerLoad;
