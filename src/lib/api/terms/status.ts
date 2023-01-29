import { server_terms_validator } from '$lib/zod/Terms';
import { z } from 'zod';
import { Api } from '../api';

export class TermsStatus {
  static endpoint = '/_/terms/status';

  static response = z.union([
    z.object({
      success: z.literal(true),
      accepted: z.literal(false),
      latest_version: server_terms_validator
    }),
    z.object({
      success: z.literal(true),
      accepted: z.literal(true)
    }),
    Api.generic_failure_validator
  ]);

  static async get() {
    return await Api.get<TermsStatusResponse>(
      TermsStatus.endpoint,
      TermsStatus.response
    );
  }
}

export type TermsStatusResponse = z.infer<typeof TermsStatus.response>;
