import type { OpenAIModResult } from '$lib/zod/OpenAI';

type APIResponse = {
  choices?: { text: string }[];
  usage?: {
    total_tokens: number;
  };
};

const leading_newlines = /^(\n+)?/g;

export class OpenAI {
  static MODERATIONS_ENDPOINT = 'https://api.openai.com/v1/completions';
  static MODEL_ID: string = 'text-davinci-003';

  static API_KEY: string;

  static async moderate(input: string[]): Promise<OpenAIModResult> {
    // console.log('> input:', input);
    // console.log('>> getprompt', this.getPrompt(input));

    const req = await fetch(this.MODERATIONS_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.MODEL_ID,
        prompt: this.getPrompt(input),
        temperature: 0.2,
        max_tokens: 256,
        frequency_penalty: 1.0
      })
    });

    const json = await req.json<APIResponse | undefined>();
    let result = this.getResult(json);

    result.total_tokens ||= json?.usage?.total_tokens;

    console.log('>> json', json);
    console.log('>> result:', result);

    return result;
  }

  static getPrompt(input: string[]) {
    const prompt = `Pocketrides is a social media platform that moderates content explicitely mentioned in its rules. Illegal activities such as providing fake IDs or reference services, trafficking drugs, or promoting violence are against its rules. Additionally, content that infringes intellectual property rights, promotes counterfeit goods, and any content deemed unfair, predatory, deceptive or intending to spread disinformation is against its rules. Additionally, graphically explicit adult content or gore, political speech, hate speech, and adult activities such as explicit pornography, prostitution, and gambling are against its rules. Content not specifically mentioned by these rules is okay, even if it's inappropriate. Analyze the following content to find out if it's covered by the rules of Pocketrides. If against the rules, reply "yes" and how it is against the rules. If no, reply "no".\n\n`;

    return [
      prompt,
      ...input.map((v) => ` ${v.length > 220 ? v.substring(0, 220) + '…' : v}\n\n`)
    ].join('');
  }

  static getResult(json?: APIResponse): OpenAIModResult {
    if (json && json.choices && json.choices[0] && json.choices[0].text) {
      const parsed = this.parseResponseText(json.choices[0].text);

      if (parsed) return parsed;
    }

    return {
      allow_likes: false,
      response_text: `We had a problem moderating this and have disabled likes out of an abundance of caution.`
    };
  }

  static parseResponseText(text: string): OpenAIModResult | undefined {
    const yesish = text.match(/^(\n+)?(yes)/i);
    const noish = text.match(/^(\n+)?(no)/i);

    if (yesish) {
      return {
        allow_likes: false,
        response_text: text.replace(leading_newlines, '')
      };
    }

    if (noish) {
      return {
        allow_likes: true,
        response_text: text.replace(leading_newlines, '')
      };
    }

    console.warn(`[OpenAI] > couldn't match API response:`, text);

    return undefined;
  }
}
