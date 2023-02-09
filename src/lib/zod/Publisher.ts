import { z } from 'zod';

export const shape = z.object({
  post_id: z.string(),
  notification: z.boolean().optional()
});

export const friends = z.object({
  target: z.enum(['followers', 'close_friends'])
});

export const pocket = z.object({
  target: z.literal('pocket'),
  pocket_id: z.string()
});

export const queue = z.object({
  my_nametag_id: z.string(),
  after_ref_id: z.string().optional()
});

export const publisher_payload = z.discriminatedUnion('target', [
  shape.extend(friends.shape),
  shape.extend(pocket.shape)
]);

export const queue_payload = z.discriminatedUnion('target', [
  queue.extend(friends.shape).extend(shape.shape),
  queue.extend(pocket.shape).extend(shape.shape)
]);

export type PublisherQueuePayload = z.infer<typeof queue_payload>;
