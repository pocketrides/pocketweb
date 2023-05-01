import { Api } from '../api';

export class DeletePostRequest {
  static async delete(post_id: string): Promise<boolean> {
    const req = await fetch(`/_/post/${post_id}/delete`, {
      method: 'DELETE'
    });
    const res = await req.json();
    const parsed = Api.generic_response.safeParse(res);

    if (parsed.success) return parsed.data.success;
    return false;
  }
}
