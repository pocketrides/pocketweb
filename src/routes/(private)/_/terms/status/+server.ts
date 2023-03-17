import type { TermsStatusResponse } from '$lib/api/terms/status';
import { Account } from '$lib/server/db/Account';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Terms } from '$lib/server/db/Terms';

export const GET = (async (event) => {
  let result: TermsStatusResponse = { success: false };

  if (event.locals.fauna_account) {
    const latest_version = await Terms.getLatestVersion();

    if (latest_version) {
      const accepted =
        latest_version.version === event.locals.fauna_account.terms_version;
      if (accepted) result = { success: true, accepted: true };
      else result = { success: true, accepted: false, latest_version };
    }
  }

  return json(result);
}) satisfies RequestHandler;
