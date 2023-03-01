import { StripeClient } from '$lib/server/StripeClient';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Account } from '$lib/server/db/Account';

export const GET = (async (event) => {
  // const invoice = await StripeClient.client().invoices.retrieve(
  //   'in_1MXVF5LgF5G1GDOmV4DEWhSu'
  // );

  // console.log(invoice);
  const charge = await StripeClient.client().charges.retrieve(
    'ch_3MXVF5LgF5G1GDOm1jcCWqwN'
  );

  console.log(charge);
  return json({});
}) satisfies RequestHandler;
