import type { PageLoad } from './$types';

export const load = (async () => {
  return {
    footer_disabled: true
  };
}) satisfies PageLoad;
