import { link_validator } from '$lib/zod/Link';
import { z } from 'zod';
import { Api } from '../api';

export class AddLinkRequest {
  static payload_parser = z.object({
    link: z.string().url()
  });

  static response_parser = z.object({
    success: z.boolean(),
    link: link_validator.optional()
  });

  static async post(payload: AddLinkRequestPayload) {
    return await Api.post<AddLinkRequestResponse>(
      '/_/link/add',
      payload,
      this.response_parser
    );
  }
}

export type AddLinkRequestPayload = z.infer<typeof AddLinkRequest.payload_parser>;
export type AddLinkRequestResponse = z.infer<typeof AddLinkRequest.response_parser>;
