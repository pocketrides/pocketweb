import type { MagicBellConfigOptions } from '@magicbell/core/dist/MagicBellClient';

export const getConfig = async (
  api_key: string,
  api_secret: string,
  nametag_id?: string
): Promise<MagicBellConfigOptions | undefined> => {
  if (nametag_id) {
    const encoder = new TextEncoder();
    const alg = { name: 'HMAC', hash: 'SHA-256' };
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(api_secret),
      alg,
      false,
      ['sign', 'verify']
    );
    const sig = await crypto.subtle.sign(alg.name, key, encoder.encode(nametag_id));
    const digest = Buffer.from(sig).toString('base64');

    return {
      apiKey: api_key,
      userExternalId: nametag_id,
      userKey: digest
    };
  } else return undefined;
};
