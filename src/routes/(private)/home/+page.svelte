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
  import WorldfeedNav from '$lib/components/worldfeed/WorldfeedNav.svelte';
  import Row from '$lib/components/Row.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import WhyPocketrides from '$lib/sheets/WhyPocketrides.svelte';
  import Button from '$lib/components/Button.svelte';
  import ButtonRow from '$lib/components/ButtonRow.svelte';

  let scroll_key = $page.data.my_nametag?.id || '';

  export let data: PageData;

  $: $App.theme = data.my_nametag.theme;
  // $: $App.fill = 'system-light';

  let can_save_scroll = false;
  let chill = true;

  const page_controller = writable<FeedResponse>(blankFeedResponse());

  onMount(async () => {
    if (browser) {
      const cached_ids = await IDBFeedCache.getFeed();
      $page_controller.post_ids = cached_ids;

      if ($page_controller.post_ids.length === 0) loadMore().then(() => {});

      await tick();

      scrollToEnhanced(
        () => {
          const y = sessionStorage?.getItem(`${scroll_key}-home-y`);

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
      and_overwrite
        ? undefined
        : $page_controller.post_ids[$page_controller.post_ids.length - 1]
    );

    if (and_overwrite) {
      page_controller.update((prev) => {
        prev.post_ids = feed.post_ids;
        prev.after_id = feed.after_id;

        return prev;
      });
    } else {
      page_controller.update((prev) => {
        prev.post_ids.push.apply(prev.post_ids, feed.post_ids);

        return prev;
      });
    }

    if (and_overwrite) {
      await IDBFeedCache.clear();
    }

    await IDBFeedCache.save(feed.post_ids);
  };

  const saveScrollY = () => {
    if (can_save_scroll) {
      sessionStorage?.setItem(`${scroll_key}-home-y`, window.scrollY.toString());
    }
  };
</script>

<svelte:head>
  {#if data.my_nametag}
    <title>your home feed | on pocketrides!</title>
  {/if}
</svelte:head>

<svelte:window on:scroll={saveScrollY} />

<SiteHeader huddable>
  <h1 slot="left">
    <Icon icon="chair" />
    Home feed
  </h1>
</SiteHeader>
<div class:chill>
  <Main padded={false} fullheight>
    <ScrollList
      has_none={$page_controller.post_ids.length === 0}
      load_more_label="Load newest"
      on:loadmore={async () => {
        await loadMore(true);
      }}
    >
      {#each $page_controller.post_ids as post_id (post_id)}
        <Post {post_id} />
      {/each}
    </ScrollList>
    <div class="scroll">
      <ButtonRow let:controller>
        <Button
          icon="keyboard_arrow_up"
          label="Top"
          {controller}
          on:click={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            controller.update(() => '');
          }}
        />
        <Button
          icon="keyboard_arrow_down"
          label="Bottom"
          {controller}
          on:click={() => {
            const main = document.querySelector('main'),
              util_nav = document.querySelector('[data-util-nav]');

            if (!main || !util_nav) return;

            window.scrollTo({
              top: main.offsetTop + main.offsetHeight - 16 - window.innerHeight,
              behavior: 'smooth'
            });

            controller.update(() => '');
          }}
        />
      </ButtonRow>
    </div>
    <!-- <CreateContentUtilityNav slot="utility-nav" feed_controls /> -->
  </Main>
</div>

{#if !$page.data.my_nametag?.stripe?.has_sub}
  <WhyPocketrides />
{/if}

<style lang="scss">
  .chill {
    opacity: 0;
  }

  .scroll {
    position: fixed;
    right: 1rem;
    bottom: calc(78px + 1rem);
  }
</style>
