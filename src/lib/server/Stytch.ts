import * as stytch from 'stytch';

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
}
