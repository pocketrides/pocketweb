/**
 * Cloudflare cache helper
 *
 * Example:

let response = await getCachedResponse(event);

if (!response) {
  response = json({ foo: 'bar' });
  putCachedResponse(event, response, 60);
}

return response;

 */

import type { RequestEvent } from '@sveltejs/kit';

const lengths = {
  short: 60 * 1, // 60 seconds
  long: 60 * 15 // 15 minutes
};

type CacheLength = keyof typeof lengths | number;

const cacheAndKey = (event: RequestEvent) => {
  return {
    // @ts-ignore
    cache: caches.default as Cache,
    key: new Request(event.request.url.toString(), event.request.clone())
  };
};

export const getCachedResponse = async (
  event: RequestEvent
): Promise<Response | undefined> => {
  if (typeof caches === 'undefined') return undefined;

  const { cache, key } = cacheAndKey(event);

  const response = await cache.match(key);

  // @ts-ignore
  if (response && response.body) {
    // @ts-ignore
    return new Response(response.body.tee()[0], response);
  }
  return undefined;
};

export const putCachedResponse = (
  event: RequestEvent,
  response: Response,
  length: CacheLength
) => {
  if (typeof caches === 'undefined') return;

  response = response.clone();

  const { cache, key } = cacheAndKey(event);

  if (typeof length === 'number') {
    response.headers.append('Cache-Control', `s-maxage=${length}`);
  } else {
    // @ts-ignore
    response.headers.append('Cache-Control', `s-maxage=${lengths[length]}`);
  }

  response.headers.delete('Set-Cookie');

  // @ts-ignore
  if (event.platform && event.platform.context) {
    // @ts-ignore
    event.platform.context.waitUntil(cache.put(key, response));
  }
};
