import { Api } from '../api';
import { draft_quarantine_validator } from '$lib/zod/Quarantine';
import type { z } from 'zod';

export class QuarantineDestroyRequest {
  static endpoint = '/_/quarantine/destroy';

  static payload = draft_quarantine_validator;

  static response = Api.generic_response;

  static async post(payload: QuarantineDestroyPayload) {
    return await Api.post(this.endpoint, payload, this.response);
  }
}

export type QuarantineDestroyPayload = z.infer<
  typeof QuarantineDestroyRequest.payload
>;
export type QuarantineDestroyResponse = z.infer<
  typeof QuarantineDestroyRequest.response
>;
