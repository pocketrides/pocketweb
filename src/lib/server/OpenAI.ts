import {
  openai_moderation_result_parser,
  type OpenAIModerationResult
} from '$lib/zod/OpenAI';

export class OpenAI {
  static MODERATIONS_ENDPOINT = 'https://api.openai.com/v1/completions';
  static MODEL_ID: string = 'text-davinci-003';

  static API_KEY: string;

  static async moderate(
    input: string[]
  ): Promise<OpenAIModerationResult | undefined> {
    const req = await fetch(this.MODERATIONS_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.MODEL_ID,
        prompt: this.getPrompt(input)
      })
    });

    const json: Partial<OpenAIModerationResult> = await req.json();

    console.log('>> json:', JSON.stringify(json));

    const parsed = openai_moderation_result_parser.safeParse(json);

    console.log('>> parsed:', JSON.stringify(parsed));

    if (parsed.success) {
      const result: OpenAIModerationResult = Object.assign(parsed.data, {
        flags: this.humanize(parsed.data)
      });

      console.log('>>>', result);

      return result;
    }
  }

  static getPrompt(input: string[]) {
    return `Test the following items based on this policy.`;
  }

  static humanize(res: OpenAIModerationResult) {
    let flags: string[] = [];

    res.results.forEach((result) => {
      for (let key of Object.keys(result.categories)) {
        if (result.categories[key] === true) {
          flags.push(key);
        }
      }

      for (let key of Object.keys(result.category_scores)) {
        if (result.category_scores[key] > 50) {
          flags.push(key);
        }
      }
    });

    return Array.from(new Set(flags));
  }
}
