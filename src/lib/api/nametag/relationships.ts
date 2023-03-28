import { z } from 'zod';
import { client_nametag_validator, type ClientNametag } from '$lib/zod/Nametag';
import { Api, type ApiGenericFailureResponse } from '../api';

export class NametagRelationshipsRequest {
  static get_friends_validator = z.object({
    success: z.boolean(),
    nametags: z.array(client_nametag_validator)
  });

  static async getFriends(nametag_id: string) {
    return Api.get<NametagRelationshipsGetFriendsRequest>(
      `/_/nametag/${nametag_id}/friends`,
      this.get_friends_validator
    );
  }
}

export type NametagRelationshipsGetFriendsRequest =
  | {
      success: true;
      nametags: ClientNametag[];
    }
  | ApiGenericFailureResponse;
