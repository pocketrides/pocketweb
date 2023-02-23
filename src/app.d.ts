/// <reference types="@cloudflare/workers-types"/>

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      fauna_account_id?: string;
      nametag_id?: string;
      mb_api_key: string;
      mb_api_secret: string;
    }
    interface PageData {
      page_theme?: import('$lib/zod/Theme').ThemeAnyValue;
      my_nametag?: import('$lib/zod/Nametag').ServerNametag;
    }
    interface Platform {
      context?: ExecutionContext;
      env: {
        FAUNA_SECRET: string;

        STYTCH_PROJECT_ID: string;
        STYTCH_PROJECT_SECRET: string;
        STYTCH_ENV: 'test' | 'live';

        STRIPE_KEY: string;
        STRIPE_SIGNING_SECRET: string;

        MAGICBELL_KEY: string;
        MAGICBELL_SECRET: string;

        OPEN_AI_KEY: string;

        POCKETQUEUE: Queue<import('$lib/zod/Publisher').PublisherQueuePayload>;
      };
    }
  }
}

export {};
