declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      fauna_account_id?: string;
      nametag_id?: string;
    }
    interface PageData {
      page_theme?: import('$lib/zod/Theme').ThemeAnyValue;
      my_nametag?: import('$lib/zod/Nametag').ServerNametag;
    }
    interface Platform {
      env: {
        FAUNA_SECRET: string;

        STYTCH_PROJECT_ID: string;
        STYTCH_PROJECT_SECRET: string;
        STYTCH_ENV: 'test' | 'live';

        STRIPE_KEY: string;
        STRIPE_SIGNING_SECRET: string;

        MAGICBELL_KEY: string;
        MAGICBELL_SECRET: string;
      };
    }
  }
}

export {};
