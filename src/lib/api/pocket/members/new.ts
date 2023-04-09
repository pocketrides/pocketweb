import { Api } from '$lib/api/api';
import type { z } from 'zod';

export class NewPocketMemberRequest {
  static response_validator = Api.generic_response;

  static async post(pocket_id: string) {
    return await Api.post<NewPocketMemberResponse>(
      `/_/pocket/${pocket_id}/members/new`,
      {},
      this.response_validator
    );
  }
}

export type NewPocketMemberResponse = z.infer<
  typeof NewPocketMemberRequest.response_validator
>;
