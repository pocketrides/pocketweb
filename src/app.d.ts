/// <reference types="@cloudflare/workers-types"/>

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      fauna_account_id?: string | null;
      fauna_account?: import('$lib/zod/Account').ServerAccount;
      nametag_id?: string | null;
      nametag?: import('$lib/zod/Nametag').ServerNametag;
      room_host: string;
      room_key?: string;
      session_expires?: import('$lib/zod/Stytch').DateString;
      magic_nametag_id: string;
      magic_post_id: string;
    }
    interface PageData {
      page_theme?: import('$lib/zod/Theme').ThemeAnyValue;
      my_nametag?: import('$lib/zod/Nametag').ServerNametag;
      mb_config?: import('@magicbell/core/dist/MagicBellClient').MagicBellConfigOptions;
      room_host: string;
      room_key?: string;
      session_expires?: string;
      magic_post_id: string;
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
        STRIPE_PRICE_ID: string;

        MAGICBELL_KEY: string;
        MAGICBELL_SECRET: string;

        OPEN_AI_KEY: string;

        ROOM_HOST: string;

        POCKETQUEUE: Queue<import('$lib/zod/Pocketqueue').PocketqueuePayload>;
      };
    }
  }
}

export {};
