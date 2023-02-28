<script lang="ts">
  import { browser } from '$app/environment';
  import { LoadHomeFeedRequest } from '$lib/api/feed/home';
  import Main from '$lib/components/Main.svelte';
  import Post from '$lib/components/Post.svelte';
  import ScrollList from '$lib/components/ScrollList.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import { App } from '$lib/stores/app';
  import { IDBFeedCache } from '$lib/util/idb-feed-cache';
  import CreateContentUtilityNav from '$lib/utility-navs/CreateContentUtilityNav.svelte';
  import { blankFeedResponse, type FeedResponse } from '$lib/zod/Feed';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import type { PageData } from './$types';

  export let data: PageData;

  if (data.page_theme) $App.theme = data.page_theme;
  $App.fill = 'superlight';

  let scroll_list: HTMLDivElement | undefined;

  const page_controller = writable<FeedResponse>(blankFeedResponse());

  onMount(async () => {
    if (browser) {
      const cached_seen = await IDBFeedCache.getLastId();

      const cached_ids = await IDBFeedCache.getFeed();
      $page_controller.post_ids = cached_ids;

      loadMore().then(() => {});

      if (cached_seen) {
        setTimeout(() => {
          scroll_list
            ?.querySelector(`[data-post="${cached_seen}"]`)
            ?.scrollIntoView();
        }, 50);
      }
    }
  });

  const loadMore = async () => {
    const feed = await LoadHomeFeedRequest.load(
      $page_controller.post_ids[$page_controller.post_ids.length - 1]
    );

    page_controller.update((prev) => {
      prev.post_ids.push.apply(prev.post_ids, feed.post_ids);

      return prev;
    });

    await IDBFeedCache.save(feed.post_ids);
  };
</script>

<svelte:head>
  {#if data.my_nametag}
    <title>{data.my_nametag.nametag} | home | pocketrides!</title>
  {/if}
</svelte:head>

<SiteHeader outer_fill="system-superlight" />
<Main
  padded={false}
  minheight={$page_controller.post_ids.length === 0 ? false : true}
>
  <ScrollList
    has_none={$page_controller.post_ids.length === 0}
    load_more_label="Load newest"
    bind:el={scroll_list}
    on:loadmore={async () => {
      await loadMore();
    }}
  >
    {#each $page_controller.post_ids as post_id (post_id)}
      <Post
        {post_id}
        on:seen={async () => {
          await IDBFeedCache.saveLastId(post_id);
        }}
      />
    {/each}
  </ScrollList>
  <CreateContentUtilityNav slot="utility-nav" />
</Main>
