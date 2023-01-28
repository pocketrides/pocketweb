import { z } from 'zod';
import { Api } from '../api';

export class StytchVerify {
  static endpoint = '/_/stytch/verify';

  static payload = z.object({
    method_id: z.string(),
    code: z.string().length(6)
  });

  static response = Api.generic_response;

  static async post(payload: StytchVerifyPayload) {
    return await Api.post<StytchVerifyResponse>(
      StytchVerify.endpoint,
      payload,
      StytchVerify.response
    );
  }
}

export type StytchVerifyPayload = z.infer<typeof StytchVerify.payload>;
export type StytchVerifyResponse = z.infer<typeof StytchVerify.response>;
