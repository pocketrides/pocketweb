import { Api } from '$lib/api/api';
import { z } from 'zod';

export class NametagCollabRemoveRequest {
  static validator = z.object({
    success: z.boolean(),
    removed_account_id: z.string().optional(),
    needs_reload: z.boolean().optional()
  });

  static payload = z.object({
    authorized_nametag_id: z.string()
  });

  static async remove(authorized_nametag_id: string) {
    const res = await Api.post<NametagCollabRemoveResponse>(
      `/_/nametag/collab/remove`,
      { authorized_nametag_id },
      this.validator
    );

    // typescript mistakes from long ago bite sometimes
    if (res.success === true) {
      return {
        success: res.success,
        needs_reload: res.needs_reload
      } as NametagCollabRemoveResponse;
    }

    return { success: false } as NametagCollabRemoveResponse;
  }
}

export type NametagCollabRemoveResponse = z.infer<
  typeof NametagCollabRemoveRequest.validator
>;
