import { z } from 'zod';

export type OpenAIModResult = {
  allow_likes: boolean;
  response_text: string;
  total_tokens?: number;
  raw_response?: any;
};

export const openai_mod_result_validator = z.object({
  allow_likes: z.boolean(),
  response_text: z.string(),
  total_tokens: z.number().optional(),
  raw_response: z.any().optional()
});
