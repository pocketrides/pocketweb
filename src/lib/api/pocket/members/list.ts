import { Api } from '$lib/api/api';
import { client_pocket_member_validator } from '$lib/zod/PocketMember';
import { z } from 'zod';

export class PocketMemberListRequest {
  static response_validator = z.object({
    success: z.boolean(),
    members: z.array(client_pocket_member_validator)
  });

  static async get(pocket_id: string) {
    return (await Api.get(
      `/_/pockets/${pocket_id}/members`,
      this.response_validator
    )) as PocketMemberListResponse;
  }
}

export type PocketMemberListResponse = z.infer<
  typeof PocketMemberListRequest.response_validator
>;
