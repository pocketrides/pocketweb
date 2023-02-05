import { z } from 'zod';
import { Api } from '../api';

export class RemoveCloseFriendRequest {
  static endpoint = '/_/relationship/remove-close-friend';

  static payload = z.object({
    target_nametag_id: z.string()
  });

  static response = Api.generic_response;

  static async post(payload: RemoveCloseFriendRequestPayload) {
    return await Api.post(
      RemoveCloseFriendRequest.endpoint,
      payload,
      RemoveCloseFriendRequest.response
    );
  }
}

export type RemoveCloseFriendRequestPayload = z.infer<
  typeof RemoveCloseFriendRequest.payload
>;
export type RemoveCloseFriendRequestResponse = z.infer<
  typeof RemoveCloseFriendRequest.response
>;
