<script lang="ts">
  import { App } from '$lib/stores/app';
  import { writable } from 'svelte/store';
  import type { PageData } from './$types';
  import Main from '$lib/components/Main.svelte';
  import PocketUtilityNav from './ui/PocketActions.svelte';
  import type { ClientPocketMember } from '$lib/zod/PocketMember';
  import Row from '$lib/components/Row.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import ScrollList from '$lib/components/ScrollList.svelte';
  import Post from '$lib/components/Post.svelte';
  import { onMount, tick } from 'svelte';
  import { LoadPocketFeedRequest } from '$lib/api/feed/pocket';
  import { type FeedResponse, blankFeedResponse } from '$lib/zod/Feed';
  import { browser } from '$app/environment';
  import { scrollToEnhanced } from '$lib/util/scroll-to';
  import Button from '$lib/components/Button.svelte';
  import ButtonRow from '$lib/components/ButtonRow.svelte';
  import { is_standalone } from '$lib/util/is-standalone';

  export let data: PageData;

  const pocket = writable(data.pocket);
  const my_membership = writable<ClientPocketMember | undefined>(data.my_membership);
  const page_controller = writable<FeedResponse>(blankFeedResponse());

  $: $pocket = data.pocket;
  $: $my_membership = data.my_membership;
  $: scroll_key = $pocket.id;

  $App.theme = $pocket.theme;
  // $App.fill = 'dark';

  let can_save_scroll = false;
  let chill = true;

  onMount(async () => {
    if (browser) {
      await tick();

      loadMore().then(() => {});

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

  const loadMore = async () => {
    const feed = await LoadPocketFeedRequest.load(
      $pocket.id,
      $page_controller.post_ids[$page_controller.post_ids.length - 1]
    );

    page_controller.update((prev) => {
      prev.post_ids.push.apply(prev.post_ids, feed.post_ids);

      return prev;
    });
  };

  const saveScrollY = () => {
    if (can_save_scroll) {
      sessionStorage?.setItem(`${scroll_key}-home-y`, window.scrollY.toString());
    }
  };
</script>

<svelte:window on:scroll={saveScrollY} />

<div class:chill>
  <Main padded={false}>
    <!-- <Row padded>
      <h2 slot="left">
        <Icon icon="signpost" />
        Posts
      </h2>
    </Row> -->
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
  </Main>
</div>

<style lang="scss">
  .chill {
    opacity: 0;
  }

  .scroll {
    position: fixed;
    right: 1rem;
    bottom: calc(78px + 1rem + env(safe-area-inset-bottom));
    z-index: 50;
  }
</style>
