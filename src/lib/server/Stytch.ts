import type {
  StytchAuthenticatedResponse,
  StytchCustomClaims
} from '$lib/zod/Stytch';
import * as stytch from 'stytch';
import { MAX_AGE_MINUTES } from './Cookies';
import type { ServerAccount } from '$lib/zod/Account';
import type { ServerNametag } from '$lib/zod/Nametag';

export class Stytch {
  static PROJECT_ID: string;
  static SECRET: string;
  static ENV: 'live' | 'test' | string;

  static client() {
    return new stytch.Client({
      project_id: Stytch.PROJECT_ID,
      secret: Stytch.SECRET,
      env: Stytch.ENV === 'live' ? stytch.envs.live : stytch.envs.test
    });
  }

  static async authenticate(
    session_token: string
  ): Promise<StytchAuthenticatedResponse | undefined> {
    return this.#doAuthSession('authenticate', session_token);
  }

  static async #doAuthSession(
    source_id: string, // for logging; "who initiated this?"
    session_token?: string, // provide this
    session_jwt?: string, // or this, not both
    claims?: StytchCustomClaims
  ): Promise<StytchAuthenticatedResponse | undefined> {
    return new Promise(async (resolve) => {
      try {
        const res = await this.client().sessions.authenticate({
          session_token,
          session_jwt,
          session_duration_minutes: MAX_AGE_MINUTES,
          session_custom_claims: claims
        });

        if (res.status_code === 200) {
          const expires = new Date();
          expires.setMinutes(expires.getMinutes() + MAX_AGE_MINUTES);

          const claims = res.session.custom_claims as StytchCustomClaims | undefined;

          // console.log(`\n> claims from authenticated session:\n`, claims, `\n`);

          let fauna_account, nametag;

          try {
            fauna_account = claims?.fa ? JSON.parse(claims.fa) : undefined;
            nametag = claims?.n ? JSON.parse(claims.n) : undefined;
          } catch (e) {}

          resolve({
            stytch_user_id: res.user.user_id,
            fauna_account_id: claims?.faid,
            fauna_account,
            nametag_id: claims?.nid,
            nametag,
            session_token: res.session_token,
            session_expires: expires.toUTCString(),
            room_key: claims?.nid ? res.session_jwt : undefined
          });
        } else {
          throw new Error('bad status code', {
            cause: res
          });
        }
      } catch (e) {
        console.error(`stytch/doAuthSession [source: ${source_id}]`, e);
        resolve(undefined);
      }
    });
  }

  static async upgradeSessionWithAccount(
    session_token: string,
    fauna_account_id: string,
    fauna_account: ServerAccount
  ) {
    return this.#doAuthSession(
      'upgradeSessionWithAccount',
      session_token,
      undefined,
      {
        faid: fauna_account_id,
        fa: JSON.stringify(fauna_account)
      }
    );
  }

  static async upgradeSessionWithNametag(
    session_token: string,
    nametag_id: string,
    nametag: ServerNametag
  ) {
    return this.#doAuthSession(
      'upgradeSessionWithNametag',
      session_token,
      undefined,
      {
        // faid: fauna_account_id,
        nid: nametag_id,
        n: JSON.stringify(nametag)
      }
    );
  }
}
