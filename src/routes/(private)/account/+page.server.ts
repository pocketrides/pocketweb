import { Account } from '$lib/server/db/Account';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
  const parent = await event.parent();

  const account = await Account.getByFaunaId(
    event.locals.fauna_account_id as string
  );

  return {
    my_nametag: parent.my_nametag,
    page_theme: parent.my_nametag?.theme,
    account
  };
}) satisfies PageServerLoad;
