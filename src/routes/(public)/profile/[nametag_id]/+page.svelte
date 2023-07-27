<script lang="ts">
  import { page } from '$app/stores';
  import { App } from '$lib/stores/app';
  import { writable } from 'svelte/store';
  import type { PageData } from './$types';
  import ScrollList from '$lib/components/ScrollList.svelte';
  import Post from '$lib/components/Post.svelte';
  import Row from '$lib/components/Row.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import { LoadNametagFeedRequest } from '$lib/api/feed/nametag';
  import ProfileFreeModeHeader from './ui/ProfileFreeModeHeader.svelte';
  import WhyPocketrides from '$lib/sheets/WhyPocketrides.svelte';
  import PocketInspiration from '$lib/sheets/PocketInspiration.svelte';
  import { is_standalone } from '$lib/util/is-standalone';
  import Button from '$lib/components/Button.svelte';
  import ButtonRow from '$lib/components/ButtonRow.svelte';

  export let data: PageData;

  $App.theme = data.page_nametag.theme;

  const page_controller = writable(data);

  $: $page_controller = data;

  const loadMore = async () => {
    const feed = await LoadNametagFeedRequest.load(
      data.nametag_id,
      $page_controller.after_id
    );

    page_controller.update((prev) => {
      if (feed.post_ids) prev.post_ids.push.apply(prev.post_ids, feed.post_ids);

      prev.after_id = feed.after_id;
      prev.has_more = feed.has_more ? true : false;

      return prev;
    });
  };
</script>

<Row padded>
  <h2 slot="left">
    <Icon icon="signpost" />
    Posts
  </h2>
</Row>

{#if $page_controller.is_my_profile_page && $page.data.my_nametag?.stripe?.free_mode}
  <ProfileFreeModeHeader />
  <WhyPocketrides />
  <PocketInspiration />
{:else}
  <ScrollList
    has_none={$page_controller.post_ids.length === 0}
    has_more={$page_controller.has_more}
    no_more={$page_controller.has_more === false}
    on:loadmore={loadMore}
  >
    {#each $page_controller.post_ids as post_id (post_id)}
      <Post {post_id} />
    {/each}
  </ScrollList>
{/if}

<div class="scroll">
  <ButtonRow vertical>
    <Button
      icon="keyboard_arrow_up"
      label=""
      on:click={() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    />
    <Button
      icon="keyboard_arrow_down"
      label=""
      on:click={() => {
        const main = document.querySelector('main');

        if (!main) return;

        window.scrollTo({
          top:
            main.offsetTop +
            main.offsetHeight -
            window.innerHeight +
            80 +
            (is_standalone ? 28 : 0),
          behavior: 'smooth'
        });
      }}
    />
  </ButtonRow>
</div>

<style lang="scss">
  .scroll {
    position: fixed;
    right: 1rem;
    bottom: calc(78px + 1rem + env(safe-area-inset-bottom));
    z-index: 50;
  }
</style>
