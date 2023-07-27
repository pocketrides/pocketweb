import type { ServerPost } from '$lib/zod/Post';
import algoliasearch from 'algoliasearch';
import { createFetchRequester } from '@algolia/requester-fetch';
import * as Sentry from '@sentry/svelte';

const INDEX_POSTS = 'all_posts';
const INDEX_POCKETS = 'all_pockets';
const INDEX_NAMETAGS = 'all_nametags';

export class AlgoliaClient {
  static ALGOLIA_BACKEND_KEY: string;
  static ALGOLIA_APP_ID: string;

  static client() {
    return algoliasearch(this.ALGOLIA_APP_ID, this.ALGOLIA_BACKEND_KEY, {
      requester: createFetchRequester()
    });
  }

  static async savePost(post: ServerPost) {
    try {
      console.log('>> saving');
      const index = this.client().initIndex(INDEX_POSTS);
      const record = {
        objectID: post.id,
        ...post
      };

      return index.saveObject(record).wait();
    } catch (e) {
      Sentry.captureException(e);
      console.log('>> save failed', e);
    }
  }
}
