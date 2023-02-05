import { z } from 'zod';
import { Api } from '../api';

export class BlockRequest {
  static endpoint = '/_/relationship/block';

  static payload = z.object({
    target_nametag_id: z.string()
  });

  static response = Api.generic_response;

  static async post(payload: BlockRequestPayload) {
    return await Api.post(BlockRequest.endpoint, payload, BlockRequest.response);
  }
}

export type BlockRequestPayload = z.infer<typeof BlockRequest.payload>;
export type BlockRequestResponse = z.infer<typeof BlockRequest.response>;
