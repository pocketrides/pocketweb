import { z } from 'zod';
import { Api } from '../api';

export class AddCloseFriendRequest {
  static endpoint = '/_/relationship/add-close-friend';

  static payload = z.object({
    target_nametag_id: z.string()
  });

  static response = Api.generic_response;

  static async post(payload: AddCloseFriendRequestPayload) {
    return await Api.post(
      AddCloseFriendRequest.endpoint,
      payload,
      AddCloseFriendRequest.response
    );
  }
}

export type AddCloseFriendRequestPayload = z.infer<
  typeof AddCloseFriendRequest.payload
>;
export type AddCloseFriendRequestResponse = z.infer<
  typeof AddCloseFriendRequest.response
>;
