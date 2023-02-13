import { Api } from '../api';
import { draft_quarantine_validator } from '$lib/zod/Quarantine';
import type { z } from 'zod';

export class QuarantineCreateRequest {
  static endpoint = '/_/quarantine/create';

  static payload = draft_quarantine_validator;

  static response = Api.generic_response;

  static async post(payload: QuarantineCreatePayload) {
    return await Api.post(this.endpoint, payload, this.response);
  }
}

export type QuarantineCreatePayload = z.infer<
  typeof QuarantineCreateRequest.payload
>;
export type QuarantineCreateResponse = z.infer<
  typeof QuarantineCreateRequest.response
>;
