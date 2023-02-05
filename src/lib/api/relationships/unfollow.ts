import { z } from 'zod';
import { Api } from '../api';

export class UnfollowRequest {
  static endpoint = '/_/relationship/unfollow';

  static payload = z.object({
    target_nametag_id: z.string()
  });

  static response = Api.generic_response;

  static async post(payload: UnfollowRequestPayload) {
    return await Api.post(
      UnfollowRequest.endpoint,
      payload,
      UnfollowRequest.response
    );
  }
}

export type UnfollowRequestPayload = z.infer<typeof UnfollowRequest.payload>;
export type UnfollowRequestResponse = z.infer<typeof UnfollowRequest.response>;
