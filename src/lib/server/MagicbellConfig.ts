import type { MagicBellConfigOptions } from '@magicbell/core/dist/MagicBellClient';

export class MagicbellConfig {
  static MAGICBELL_KEY: string;
  static MAGICBELL_SECRET: string;

  static async getConfig(
    nametag_id?: string | null
  ): Promise<MagicBellConfigOptions | undefined> {
    if (nametag_id) {
      const encoder = new TextEncoder();
      const alg = { name: 'HMAC', hash: 'SHA-256' };
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(this.MAGICBELL_SECRET),
        alg,
        false,
        ['sign', 'verify']
      );
      const sig = await crypto.subtle.sign(
        alg.name,
        key,
        encoder.encode(nametag_id)
      );
      const digest = Buffer.from(sig).toString('base64');

      return {
        apiKey: this.MAGICBELL_KEY,
        userExternalId: nametag_id,
        userKey: digest
      };
    } else return undefined;
  }
}
