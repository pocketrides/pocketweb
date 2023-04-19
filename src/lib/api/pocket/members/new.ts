import { Api } from '$lib/api/api';
import { z } from 'zod';

export class NewPocketMemberRequest {
  static response_validator = z.object({
    success: z.boolean(),
    reason: z.enum(['max_free']).optional()
  });

  static async post(pocket_id: string): Promise<NewPocketMemberResponse> {
    const res: any = await Api.post<NewPocketMemberResponse>(
      `/_/pocket/${pocket_id}/members/new`,
      {},
      this.response_validator
    );

    return {
      success: res.success,
      reason: res.reason || undefined
    };
  }
}

export type NewPocketMemberResponse = z.infer<
  typeof NewPocketMemberRequest.response_validator
>;
