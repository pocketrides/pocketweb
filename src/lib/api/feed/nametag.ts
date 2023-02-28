import {
  blankFeedResponse,
  feed_response_validator,
  type FeedResponse
} from '$lib/zod/Feed';

export class LoadNametagFeedRequest {
  static endpoint = '/_/feed/';

  static validator = feed_response_validator;

  static async load(nametag_id: string, after_id?: string): Promise<FeedResponse> {
    const req = await fetch(`${this.endpoint}${nametag_id}`, {
      method: after_id ? 'POST' : 'GET',
      body: after_id ? JSON.stringify({ after_id }) : undefined
    });

    const data = this.validator.safeParse(await req.json());

    if (data.success) {
      return data.data;
    } else {
      return blankFeedResponse();
    }
  }
}
