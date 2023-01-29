import { z } from 'zod';
import { Api, type ApiGenericResponse } from '../api';

export class TermsAccept {
  static endpoint = '/_/terms/accept';

  static payload = z.object({
    version: z.string()
  });

  static response = Api.generic_response;

  static async post(payload: TermsAcceptPayload) {
    return await Api.post<ApiGenericResponse>(
      TermsAccept.endpoint,
      payload,
      TermsAccept.response
    );
  }
}

export type TermsAcceptPayload = z.infer<typeof TermsAccept.payload>;
