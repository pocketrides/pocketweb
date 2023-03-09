import { z } from 'zod';

export type FeedResponse<T = string> = {
  post_ids: T[];
  after_id?: string;
  before_id?: string;
  has_more?: boolean;
};

export const feed_response_validator = z.object({
  post_ids: z.array(z.string()),
  after_id: z.string().optional(),
  before_id: z.string().optional(),
  has_more: z.boolean().optional()
});

export const blankFeedResponse = (): FeedResponse => {
  return {
    post_ids: [],
    has_more: true
  };
};
