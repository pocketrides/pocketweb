import { z } from 'zod';
import { client_ref_validator } from './Fauna';

export const draft_moderation_result_validator = z.object({
  failed: z.boolean(),

  // 0-1, threshold is .75 for click to show
  severity: z.number(),
  reason: z.string().optional(),
  context: z.string().optional()
});

export const server_moderation_result_validator =
  draft_moderation_result_validator.extend({
    id: z.string(),
    post_stats_ref: client_ref_validator,
    post_ref: client_ref_validator
  });

export type DraftModerationResult = z.infer<
  typeof draft_moderation_result_validator
>;
export type ServerModerationResult = z.infer<
  typeof server_moderation_result_validator
>;

export const blankModerationResult = (): DraftModerationResult => {
  return {
    failed: false,
    severity: 0
  };
};
