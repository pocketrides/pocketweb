import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
  StytchChallenge,
  type StytchChallengeResponse
} from '$lib/api/stytch/challenge';
import { Stytch } from '$lib/server/Stytch';
import type {
  LoginOrCreateUserBySMSResponse,
  OTPWhatsAppLoginOrCreateResponse
} from 'stytch/types/lib/b2c/otps';

export const POST = (async (event) => {
  const payload = StytchChallenge.payload.safeParse(await event.request.json());
  let response: StytchChallengeResponse = { success: false };

  if (payload.success) {
    try {
      const stytch_response:
        | LoginOrCreateUserBySMSResponse
        | OTPWhatsAppLoginOrCreateResponse =
        payload.data.challenge_type === 'sms'
          ? await Stytch.client().otps.sms.loginOrCreate({
              phone_number: payload.data.phone_number
            })
          : await Stytch.client().otps.whatsapp.loginOrCreate({
              phone_number: payload.data.phone_number
            });

      if (stytch_response.status_code === 200) {
        response = {
          success: true,
          method_id: stytch_response.phone_id
        };
      } else throw new Error('bad status code', { cause: stytch_response });
    } catch (e) {
      console.error('> challenge/server', e);
    }
  }

  return json(response);
}) satisfies RequestHandler;
