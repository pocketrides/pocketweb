import { Api } from '$lib/api/api';
import { client_pocket_member_validator } from '$lib/zod/PocketMember';
import { z } from 'zod';

export class PocketMemberAdminAction {
  static payload_validator = z.object({
    pocket_id: z.string(),
    member_id: z.string(),
    new_status: z.enum(['joined', 'banned', 'deleted'])
  });

  static response_validator = z.object({
    success: z.boolean(),
    member: client_pocket_member_validator.optional()
  });

  static async #send(
    pocket_id: string,
    member_id: string,
    new_status: 'joined' | 'banned' | 'deleted'
  ): Promise<PocketMemberAdminActionResponse> {
    return (await Api.post(
      `/_/pocket/${pocket_id}/members/${member_id}`,
      {
        pocket_id,
        member_id,
        new_status
      },
      this.response_validator
    )) as PocketMemberAdminActionResponse;
  }

  static async admit(pocket_id: string, member_id: string) {
    return await this.#send(pocket_id, member_id, 'joined');
  }

  static async delete(pocket_id: string, member_id: string) {
    return await this.#send(pocket_id, member_id, 'deleted');
  }

  static async block(pocket_id: string, member_id: string) {
    return await this.#send(pocket_id, member_id, 'banned');
  }

  static async unblock(pocket_id: string, member_id: string) {
    return await this.#send(pocket_id, member_id, 'joined');
  }
}

export type PocketMemberAdminActionResponse = z.infer<
  typeof PocketMemberAdminAction.response_validator
>;
