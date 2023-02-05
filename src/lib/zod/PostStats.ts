import { z } from 'zod';
import { client_ref_validator } from './Fauna';
import { server_moderation_result_validator } from './ModerationResult';

export const draft_post_stats_validator = z.object({
  likes: z.number(),
  quarantines: z.number(),
  replies: z.number(),
  views: z.number(),
  // this is turned on only in the case of the user self-selecting click to show,
  // but *is* turned on if moderation_result's threshold is >= .75
  click_to_show: z.boolean()
});

export const server_post_stats_validator = draft_post_stats_validator.extend({
  id: z.string(),
  post_ref: client_ref_validator,

  // bolted on after payout or when quarantine has been clicked
  moderation_result_ref: client_ref_validator.optional(),
  moderation_result: server_moderation_result_validator.optional()
});

export type DraftPostStats = z.infer<typeof draft_post_stats_validator>;
export type ServerPostStats = z.infer<typeof server_post_stats_validator>;

export const blankPostStats = (): DraftPostStats => {
  return {
    likes: 0,
    quarantines: 0,
    replies: 0,
    views: 0,
    click_to_show: false
  };
};
