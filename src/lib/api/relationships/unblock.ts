import { z } from 'zod';
import { Api } from '../api';

export class UnblockRequest {
  static endpoint = '/_/relationship/unblock';

  static payload = z.object({
    target_nametag_id: z.string()
  });

  static response = Api.generic_response;

  static async post(payload: UnblockRequestPayload) {
    return await Api.post(UnblockRequest.endpoint, payload, UnblockRequest.response);
  }
}

export type UnblockRequestPayload = z.infer<typeof UnblockRequest.payload>;
export type UnblockRequestResponse = z.infer<typeof UnblockRequest.response>;
