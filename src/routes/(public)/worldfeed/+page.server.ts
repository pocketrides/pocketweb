import { WorldfeedLoadRequest } from '$lib/api/worldfeed/load.js';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
  if (event.url.searchParams.has('i') === false) {
    // @ts-ignore
    if (typeof event.request.cf !== 'undefined') {
      const sp = new URLSearchParams();

      // @ts-ignore
      if (event.request.cf?.city) {
        // @ts-ignore
        sp.append('c', event.request.cf.city);
      }

      // @ts-ignore
      if (event.request.cf?.regionCode) {
        // @ts-ignore
        sp.append('s', event.request.cf.regionCode);
      }

      // @ts-ignore
      if (event.request.cf?.country) {
        // @ts-ignore
        sp.append('i', event.request.cf?.country);
      }

      if (sp.keys.length) {
        throw redirect(302, `/worldfeed?${sp.toString()}`);
      }
    }
  }

  const worldfeed = await WorldfeedLoadRequest.get(
    event.url.searchParams,
    event.fetch
  );

  return {
    worldfeed
  };
};
