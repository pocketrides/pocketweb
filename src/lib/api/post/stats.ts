export type PostStatsResponse = {
  is_liked: boolean;
  unlike_key?: string;
  is_quarantined: boolean;
};

export class PostStatsRequest {
  static async load(post_id: string, _fetch = fetch): Promise<PostStatsResponse> {
    const req = await _fetch(`/_/post/${post_id}/stats`);
    return await req.json<PostStatsResponse>();
  }
}
