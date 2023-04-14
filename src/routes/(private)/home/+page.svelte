<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { LoadHomeFeedRequest } from '$lib/api/feed/home';
  import Main from '$lib/components/Main.svelte';
  import Post from '$lib/components/Post.svelte';
  import ScrollList from '$lib/components/ScrollList.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import { App } from '$lib/stores/app';
  import { IDBFeedCache } from '$lib/util/idb-feed-cache';
  import { scrollToEnhanced } from '$lib/util/scroll-to';
  import CreateContentUtilityNav from '$lib/utility-navs/CreateContentUtilityNav.svelte';
  import { blankFeedResponse, type FeedResponse } from '$lib/zod/Feed';
  import { onMount, tick } from 'svelte';
  import { writable } from 'svelte/store';
  import type { PageData } from './$types';

  let scroll_key = $page.data.my_nametag?.id || '';

  export let data: PageData;

  $: $App.theme = data.my_nametag.theme;
  $: $App.fill = 'system-superlight';

  let can_save_scroll = false;
  let chill = true;

  const page_controller = writable<FeedResponse>(blankFeedResponse());

  onMount(async () => {
    if (browser) {
      const cached_ids = await IDBFeedCache.getFeed();
      $page_controller.post_ids = cached_ids;

      await tick();

      loadMore(true).then(() => {});

      scrollToEnhanced(
        () => {
          const y = localStorage?.getItem(`${scroll_key}-home-y`);

          if (y) {
            window.scrollTo(0, Number(y));
          }
        },
        () => {
          can_save_scroll = true;
          chill = false;
        }
      );
    }
  });

  const loadMore = async (and_overwrite: boolean = false) => {
    const feed = await LoadHomeFeedRequest.load(
      $page_controller.post_ids[$page_controller.post_ids.length - 1]
    );

    page_controller.update((prev) => {
      prev.post_ids.push.apply(prev.post_ids, feed.post_ids);

      return prev;
    });

    if (and_overwrite) {
      await IDBFeedCache.clear();
    }

    await IDBFeedCache.save(feed.post_ids);
  };

  const saveScrollY = () => {
    if (can_save_scroll) {
      localStorage?.setItem(`${scroll_key}-home-y`, window.scrollY.toString());
    }
  };
</script>

<svelte:head>
  {#if data.my_nametag}
    <title>your home feed | on pocketrides!</title>
  {/if}
</svelte:head>

<svelte:window on:scroll={saveScrollY} />

<SiteHeader fill="system-superlight" huddable />
<div class:chill>
  <Main fill="system-light" padded={false} fullheight>
    <ScrollList
      has_none={$page_controller.post_ids.length === 0}
      load_more_label="Load newest"
      on:loadmore={async () => {
        await loadMore();
      }}
    >
      {#each $page_controller.post_ids as post_id (post_id)}
        <Post {post_id} />
      {/each}
    </ScrollList>
    <CreateContentUtilityNav slot="utility-nav" feed_controls />
  </Main>
</div>

<style lang="scss">
  .chill {
    opacity: 0;
  }
</style>
