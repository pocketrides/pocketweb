import { z } from 'zod';

const pre = (arg: unknown) => Number(Number(arg).toFixed(3));
const round = (arg: number) => Math.round(arg * 100);

export const openai_moderation_result_parser = z.object({
  id: z.string(),
  model: z.string(),
  results: z.array(
    z.object({
      flagged: z.boolean(),
      categories: z.object({
        hate: z.boolean(),
        'hate/threatening': z.boolean()
        // 'self-harm': z.boolean(),
        // sexual: z.boolean(),
        // 'sexual/minors': z.boolean(),
        // violence: z.boolean(),
        // 'violence/graphic': z.boolean()
      }),
      category_scores: z.object({
        hate: z.preprocess(pre, z.number()).refine(round),
        'hate/threatening': z.preprocess(pre, z.number()).refine(round)
        // 'self-harm': z.preprocess(pre, z.number()).refine(round),
        // sexual: z.preprocess(pre, z.number()).refine(round),
        // 'sexual/minors': z.preprocess(pre, z.number()).refine(round),
        // violence: z.preprocess(pre, z.number()).refine(round),
        // 'violence/graphic': z.preprocess(pre, z.number()).refine(round)
      })
    })
  )
});

export type OpenAIModerationResultCategory =
  | 'hate'
  | 'hate/threatening'
  | 'self-harm'
  | 'sexual'
  | 'sexual/minors'
  | 'violence'
  | 'violence/graphic';

export type OpenAIModerationResultItem = {
  flagged: boolean;
  categories: Record<string, boolean>;
  category_scores: Record<string, number>;
};

export type OpenAIModerationResult = {
  id: string;
  model: string;
  results: OpenAIModerationResultItem[];
  flags?: string[];
};
