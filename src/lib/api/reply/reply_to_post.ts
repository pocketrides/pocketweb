import {
  type ClientReply,
  client_reply_validator,
  draft_reply_validator
} from '$lib/zod/Reply';
import { z } from 'zod';
import { Api } from '../api';

export class ReplyToPostRequest {
  static endpoint = '/_/reply';

  static payload_validator = draft_reply_validator;

  static response_validator = z.discriminatedUnion('success', [
    z.object({
      success: z.literal(true),
      reply: client_reply_validator
    }),
    z.object({
      success: z.literal(false)
    })
  ]);

  static async post(payload: ReplyToPostPayload) {
    return await Api.post<ReplyToPostResponse>(
      this.endpoint,
      payload,
      this.response_validator
    );
  }
}

export type ReplyToPostPayload = z.infer<
  typeof ReplyToPostRequest.payload_validator
>;

export type ReplyToPostResponse = z.infer<
  typeof ReplyToPostRequest.response_validator
>;
