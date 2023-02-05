import { z } from 'zod';

const shape = z.object({
  post_id: z.string().optional(),
  notification_id: z.string().optional()
});

export class Publisher {
  static endpoint = '/_/publish';

  static payload = z.discriminatedUnion('target', [
    shape.extend({
      target: z.enum(['followers', 'close_friends'])
    }),
    shape.extend({
      target: z.literal('pocket'),
      pocket_id: z.string()
    })
  ]);
}

export type PublisherPayload = z.infer<typeof Publisher.payload>;
