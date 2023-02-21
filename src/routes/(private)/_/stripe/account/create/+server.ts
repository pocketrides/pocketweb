import type { ApiGenericResponse } from '$lib/api/api';
import {
  StripeClient,
  type StripeClientCustomMetadata
} from '$lib/server/StripeClient';
import { Account } from '$lib/server/db/Account';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST = (async (event) => {
  let res: ApiGenericResponse = { success: false };

  if (event.locals.fauna_account_id) {
    const account = await Account.getByFaunaId(event.locals.fauna_account_id);

    if (account) {
      if (!account.stripe_account_id) {
        const metadata: StripeClientCustomMetadata = {
          fauna_account_id: event.locals.fauna_account_id
        };

        const stripe_account = await StripeClient.client().accounts.create({
          type: 'express',
          business_profile: {
            url: `https://pocketrides.com/profile/${event.locals.nametag_id}`
          },
          metadata
        });

        if (stripe_account.id) {
          await Account.update(event.locals.fauna_account_id, {
            stripe_account_id: stripe_account.id,
            charges_enabled: false
          });

          res = { success: true };
        }
      } else {
        res = { success: true };
      }
    }
  }

  return json(res);
}) satisfies RequestHandler;
