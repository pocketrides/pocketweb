import type { ServerPost } from '$lib/zod/Post';
import { IDBCache } from '$lib/util/idb-cache';

export class LoadPostRequest {
  static async load(
    post_id: string,
    _fetch = fetch
  ): Promise<ServerPost | undefined> {
    let post = await IDBCache.get<ServerPost>(post_id);

    if (!post) {
      const req = await _fetch(`/_/post/${post_id}/retrieve`);

      if (req.status !== 200) return undefined;

      const json = await req.json<{ success: boolean; post: ServerPost }>();
      if (json.success) {
        post = json.post;
      } else {
        return undefined;
      }
      await IDBCache.put(post);
    }

    return post;
  }

  static async reload(post_id: string) {
    await IDBCache.delete(post_id);
    return await this.load(post_id);
  }

  static async overwrite(post: ServerPost) {
    await IDBCache.put(post);
  }
}
