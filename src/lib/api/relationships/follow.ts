import { z } from 'zod';
import { Api } from '../api';

export class FollowRequest {
  static endpoint = '/_/relationship/follow';

  static payload = z.object({
    target_nametag_id: z.string()
  });

  static response = Api.generic_response;

  static async post(payload: FollowRequestPayload) {
    return await Api.post(FollowRequest.endpoint, payload, FollowRequest.response);
  }
}

export type FollowRequestPayload = z.infer<typeof FollowRequest.payload>;
export type FollowRequestResponse = z.infer<typeof FollowRequest.response>;
