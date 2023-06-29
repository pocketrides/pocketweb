<script lang="ts">
  import { browser } from '$app/environment';
  import type { ServerPost } from '$lib/zod/Post';
  import type { Writable } from 'svelte/store';
  import Button from './Button.svelte';
  import ButtonRow from './ButtonRow.svelte';

  export let is_my_post: boolean;
  export let post_controller: Writable<ServerPost | undefined>;
  export let is_liking: Writable<boolean>;
  export let replies_loading: Writable<boolean>;
  export let likeClick: () => void;
  export let repliesClick: () => void;
  export let showing_mod_result: Writable<boolean>;

  // @ts-ignore
  $: has_browser_share = browser && typeof navigator?.share === 'function';
</script>

{#if $post_controller && $post_controller.stats}
  <ButtonRow>
    {#if $post_controller.settings.enable_likes === true}
      <Button
        id="likes"
        icon={$post_controller.is_liked ? 'favorite' : 'favorite_border'}
        disabled={$is_liking}
        small
        primary={$post_controller.is_liked}
        icon_filled={$post_controller.is_liked}
        count={$post_controller.stats?.likes}
        label=""
        on:click={likeClick}
      />
    {/if}
    {#if is_my_post && $post_controller?.settings?.mod_result?.allow_likes === false}
      <Button
        id="mod_result"
        icon={$showing_mod_result === true ? 'close' : 'info'}
        small
        primary={$showing_mod_result === true}
        label=""
        on:click={() => {
          $showing_mod_result = !$showing_mod_result;
        }}
      />
    {/if}
    {#if $post_controller?.settings?.enable_replies === true}
      <Button
        id="replies"
        icon={$replies_loading ? 'refresh' : 'reply'}
        icon_spins={$replies_loading}
        disabled={$replies_loading}
        small
        label={''}
        count={$post_controller.stats.replies}
        on:click={repliesClick}
      />
    {/if}

    {#if has_browser_share}
      <Button
        id="share"
        label=""
        icon="ios_share"
        small
        on:click={() => {
          try {
            navigator.share({
              url: `https://${window.location.host}/post/${$post_controller?.id}`
            });
          } catch (e) {
            // silent
            return;
          }
        }}
      />
    {/if}
  </ButtonRow>
{/if}
