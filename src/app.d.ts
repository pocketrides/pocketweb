declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      fauna_account_id?: string;
      nametag_id?: string;
    }
    interface PageData {
      page_theme?: import('$lib/zod/Theme').ThemeAnyValue;
      page_fill?: import('$lib/zod/Fill').Fill;
    }
    interface Platform {
      env: {
        FAUNA_SECRET: string;

        STYTCH_PROJECT_ID: string;
        STYTCH_PROJECT_SECRET: string;
        STYTCH_ENV: 'test' | 'live';
      };
    }
  }
}

export {};
