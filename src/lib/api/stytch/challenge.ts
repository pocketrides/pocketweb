import { z } from 'zod';
import { Api } from '../api';

export class StytchChallenge {
  static endpoint = '/_/stytch/challenge';

  static payload = z.object({
    challenge_type: z.enum(['sms', 'whatsapp']),
    phone_number: z.string()
  });

  static response = z.discriminatedUnion('success', [
    z.object({
      success: z.literal(true),
      method_id: z.string()
    }),
    Api.generic_failure_validator
  ]);
}

export type StytchChallengePayload = z.infer<typeof StytchChallenge.payload>;
export type StytchChallengeResponse = z.infer<typeof StytchChallenge.response>;
