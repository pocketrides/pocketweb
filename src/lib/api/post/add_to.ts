import { server_pocket_validator, type ServerPocket } from '$lib/zod/Pocket';
import { z } from 'zod';
import { Api, type ApiGenericResponse } from '../api';

export type AddPostToListResponse = {
  pockets: ServerPocket[];
  cohosted_pockets: ServerPocket[];
  unlisted_pockets: ServerPocket[];
  joined_pockets: ServerPocket[];
};

export class AddPostToRequest {
  static endpoint = `/_/post/[id]/add-to`;

  static list_response_validator = z.object({
    pockets: z.array(server_pocket_validator),
    cohosted_pockets: z.array(server_pocket_validator),
    unlisted_pockets: z.array(server_pocket_validator),
    joined_pockets: z.array(server_pocket_validator)
  });

  static async list(post_id: string): Promise<AddPostToListResponse> {
    const list = await Api.easyget<AddPostToListResponse>(
      this.endpoint.replace('[id]', post_id),
      this.list_response_validator
    );

    if (list) return list;

    return {
      pockets: [],
      cohosted_pockets: [],
      unlisted_pockets: [],
      joined_pockets: []
    };
  }

  static async addTo(
    post_id: string,
    pocket_id: string
  ): Promise<ApiGenericResponse> {
    return await Api.post(
      this.endpoint.replace('[id]', post_id),
      { pocket_id },
      Api.generic_response
    );
  }
}
