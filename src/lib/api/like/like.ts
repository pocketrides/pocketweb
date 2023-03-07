import type { LikePostResponse } from '$lib/zod/Like';
import type { ApiGenericResponse } from '../api';

export class Like {
  static async likePost(post_id: string): Promise<LikePostResponse> {
    const req = await fetch(`/_/like/create`, {
      method: 'POST',
      body: JSON.stringify({ post_id })
    });

    const res = await req.json<LikePostResponse>();

    return res;
  }

  static async unlikePost(unlike_key: string): Promise<boolean> {
    const req = await fetch(`/_/like/destroy`, {
      method: 'POST',
      body: JSON.stringify({ unlike_key })
    });

    const res = await req.json<ApiGenericResponse>();

    return res.success;
  }
}
