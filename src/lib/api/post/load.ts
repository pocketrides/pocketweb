import type { ServerPost } from '$lib/zod/Post';
import { PostStatsRequest } from './stats';
import { IDBCache } from '$lib/util/idb-cache';

export class LoadPostRequest {
  static async load(
    post_id: string,
    _fetch = fetch
  ): Promise<ServerPost | undefined> {
    let post; // = await IDBCache.get<ServerPost>(post_id);

    if (!post) {
      const req = await _fetch(`/_/post/${post_id}/retrieve`);

      if (req.status !== 200) return undefined;

      const json = await req.json<{ success: boolean; post: ServerPost }>();
      if (json.success) {
        post = json.post;
      } else {
        return undefined;
      }
      // await IDBCache.put(post);
    }

    // if (post.is_liked === undefined) {
    //   const stats = await PostStatsRequest.load(post.id, _fetch);

    //   post.is_liked = stats.is_liked;
    //   post.unlike_key = stats.unlike_key;
    //   post.is_quarantined = stats.is_quarantined;
    //   // await IDBCache.put(post);
    // }

    return post;
  }

  static async reload(post_id: string) {
    await IDBCache.delete(post_id);
    return await this.load(post_id);
  }
}
