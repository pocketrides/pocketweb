import { Api } from '$lib/api/api';
import { client_nametag_collab_validator } from '$lib/zod/NametagCollab';
import { z } from 'zod';

export class NametagCollabListRequest {
  static validator = z.discriminatedUnion('success', [
    z.object({
      success: z.literal(true),
      collabs: z.array(client_nametag_collab_validator)
    }),
    z.object({
      success: z.literal(false)
    })
  ]);

  static async list() {
    return await Api.get<NametagCollabListResponse>(
      `/_/nametag/collab/list`,
      this.validator
    );
  }
}

export type NametagCollabListResponse = z.infer<
  typeof NametagCollabListRequest.validator
>;
