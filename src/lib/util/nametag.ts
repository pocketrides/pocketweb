import { invalidateAll } from '$app/navigation';
import { App } from '$lib/stores/app';
import { HomepageHelper } from './homepage';
import { IDBCache } from './idb-cache';
import { IDBFeedCache } from './idb-feed-cache';

export const nametagCreateComplete = async (
  e: CustomEvent<{ first_time: boolean; nametag_id: string }>
) => {
  await IDBCache.clear();
  await IDBFeedCache.clear();

  if (e.detail.first_time === true && /\/pocket/.test(location.pathname) === false) {
    location.href = `/profile/${e.detail.nametag_id}`;
  } else {
    if (HomepageHelper.isHomepagePath()) location.href = `/home`;
    else await invalidateAll();
    App.update((prev) => {
      prev.sheet_id = '';
      return prev;
    });
  }
};
