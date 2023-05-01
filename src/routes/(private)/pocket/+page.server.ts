import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { draft_pocket_validator, type DraftPocket } from '$lib/zod/Pocket';
import { Pocket } from '$lib/server/db/Pocket';

export const load = (async (event) => {
  const parent = await event.parent();

  if (!parent.my_nametag) throw redirect(302, '/');

  let free_mode = false;
  let can_free_mode_publish = false;

  if (!parent.my_nametag.stripe?.has_sub) {
    free_mode = true;

    can_free_mode_publish = await Pocket.canFreeModePublish(parent.my_nametag.id);
  }

  let editing_pocket: DraftPocket | undefined = undefined;
  let editing_pocket_id: string | undefined = undefined;

  if (event.url.searchParams.has('edit')) {
    const pocket = await Pocket.safeRetrieve(
      parent.my_nametag.id,
      event.url.searchParams.get('edit') as string
    );

    if (pocket) {
      const draft = draft_pocket_validator.safeParse(pocket);

      if (draft.success) {
        editing_pocket = draft.data;
        editing_pocket_id = pocket.id;
      }
    }
  }

  return {
    my_nametag: parent.my_nametag,
    page_theme: parent.my_nametag.theme,
    editing_pocket,
    editing_pocket_id,
    free_mode,
    can_free_mode_publish
  };
}) satisfies PageServerLoad;
