import { publisher_payload } from '$lib/zod/Publisher';
import type { z } from 'zod';

export class Publisher {
  static endpoint = '/_/publish';

  static payload = publisher_payload;
}

export type PublisherPayload = z.infer<typeof Publisher.payload>;
