import type { OpenAIModResult } from '$lib/zod/OpenAI';

type ChatRole = 'system' | 'user' | 'assistant';

type APIChoice = {
  message: {
    role: ChatRole;
    content: string;
  };
};

type APIResponse = {
  choices?: APIChoice[];
  usage?: {
    total_tokens: number;
  };
};

type ChatCompletionMessage = {
  role: ChatRole;
  content: string;
};

const leading_newlines = /^(\n+)?/g;

export class OpenAI {
  static MODERATIONS_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
  static MODEL_ID: string = 'gpt-3.5-turbo';

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
        messages: this.getMessages(input),
        temperature: 0.2,
        max_tokens: 256,
        frequency_penalty: 1.0
      })
    });

    const json = await req.json<APIResponse | undefined>();
    let result = this.getResult(json);

    result.total_tokens ||= json?.usage?.total_tokens;

    // console.log('>> json', json);
    // console.log('>> result:', result);

    return result;
  }

  static getMessages(input: string[]): ChatCompletionMessage[] {
    const messages: ChatCompletionMessage[] = [];

    messages.push({
      role: 'system',
      content: `Pocketrides is a social media platform that moderates content explicitly mentioned in its rules. Illegal activities such as providing fake IDs or reference services, trafficking drugs, or promoting violence are against its rules. Additionally, content that infringes intellectual property rights, promotes counterfeit goods, and any content deemed unfair, predatory, deceptive or intending to spread disinformation is against its rules. Additionally, graphically explicit adult content or gore, political speech, hate speech, and adult activities such as explicit pornography, prostitution, and gambling are against its rules. Content not specifically mentioned by these rules is okay, even if it's inappropriate. Analyze the following user messages. If it contains content mentioned in the rules of Pocketrides - and it is against those rules - respond "Yes" and give a brief reason why you think the user message is against the rules. If it's not mentioned in the rules, just say "No"`
    });

    input.forEach((content) => {
      messages.push({
        role: 'user',
        content: content.length > 220 ? content.substring(0, 220) + '…' : content
      });
    });

    return messages;
  }

  static getResult(json?: APIResponse): OpenAIModResult {
    if (
      json &&
      json.choices &&
      json.choices[0] &&
      json.choices[0].message &&
      json.choices[0].message.content
    ) {
      const parsed = this.parseResponseText(json.choices[0].message.content);

      if (parsed) return parsed;
    }

    return {
      allow_likes: false,
      response_text: `We had a problem moderating this and have disabled likes out of an abundance of caution.`,
      raw_response: json
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
