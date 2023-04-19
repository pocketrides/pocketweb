import { Api, type ApiGenericResponse } from '$lib/api/api';

export class PocketMemberLeaveRequest {
  static response_validator = Api.generic_response;

  static async post(pocket_id: string) {
    return await Api.post<PocketMemberLeaveResponse>(
      `/_/pocket/${pocket_id}/members/leave`,
      {},
      this.response_validator
    );
  }
}

export type PocketMemberLeaveResponse = ApiGenericResponse;
