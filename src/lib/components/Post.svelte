<script lang="ts">
  import { page } from '$app/stores';
  import { Like } from '$lib/api/like/like';
  import { LoadPostRequest } from '$lib/api/post/load';
  import { QuarantineCreateRequest } from '$lib/api/quarantine/create';
  import { QuarantineDestroyRequest } from '$lib/api/quarantine/destroy';
  import { App } from '$lib/stores/app';
  import { RepliesManager, RepliesManagerStore } from '$lib/stores/replies';
  import { getTimeAgo } from '$lib/util/time-ago';
  import type { ServerPost } from '$lib/zod/Post';
  import { afterUpdate, createEventDispatcher, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import Button from './Button.svelte';
  import Container from './Container.svelte';
  import Gallery from './Gallery.svelte';
  import Icon from './Icon.svelte';
  import LinkDisplay from './LinkDisplay.svelte';
  import LinkList from './LinkList.svelte';
  import Nametag from './Nametag.svelte';
  import PostActionsLeft from './PostActionsLeft.svelte';
  import PostActionsRight from './PostActionsRight.svelte';
  import PostModResult from './PostModResult.svelte';
  import Row from './Row.svelte';

  export let post_id: string | undefined = undefined;
  export let post: ServerPost | undefined = undefined;
  export let wrapper_mode: boolean = false;

  let wrapper: HTMLDivElement | undefined;

  const dispatch = createEventDispatcher();
  let _seen = false;

  const post_controller = writable(post);
  const button_controller = writable('hide');
  const is_liking = writable(false);
  const is_quarantining = writable(false);
  const showing_post = writable(false);
  const loading_post = writable(false);
  const showing_mod_result = writable(false);
  const is_expanded = writable(false); // if the post is longer than 6 lines, show an "expand" button
  const replies_loading = writable(false);

  $: should_be_hidden = $post_controller
    ? $post_controller.is_quarantined ||
      ($post_controller.settings.is_nsfw &&
        $page.data.my_nametag?.content_prefs?.allow_nsfw_posts !== true)
    : false;
  $: post_hidden = should_be_hidden && $showing_post === false;
  $: is_my_post = $page.data.my_nametag?.id === $post_controller?.nametag?.id;
  $: if (
    $post_controller &&
    $post_controller.stats &&
    $RepliesManagerStore.post_id === $post_controller.id &&
    $post_controller.stats.replies !== $RepliesManagerStore.latest_count
  ) {
    $post_controller.stats.replies = $RepliesManagerStore.latest_count;
    LoadPostRequest.overwrite($post_controller);
  }

  onMount(async () => {
    try {
      if ($post_controller === undefined && post_id !== undefined) {
        $loading_post = true;
        const post = await LoadPostRequest.load(post_id);
        if (post) {
          $post_controller = post;
          $loading_post = false;
        } else {
          $loading_post = false;
        }
      }

      // always get the latest from the post detail page
      if ($post_controller !== undefined && wrapper_mode) {
        await LoadPostRequest.overwrite($post_controller);
      }
    } catch (e) {
      $loading_post = false;
    }
  });

  afterUpdate(async () => {
    if (post && post_id && post.id !== post_id) await reload();
  });

  const reload = async () => {
    const id = post_id ? post_id : post ? post.id : undefined;

    if (id) {
      const post = await LoadPostRequest.reload(id);
      if (post) $post_controller = post;
    }
  };

  const likeClick = async () => {
    if (!$page.data.my_nametag) {
      $App.sheet_id = 'onboarding';
      return;
    }

    if (!$post_controller.stats) return;

    $is_liking = true;

    if ($post_controller.is_liked && $post_controller.unlike_key) {
      $post_controller.stats.likes = $post_controller.stats.likes - 1;
      $post_controller.is_liked = false;
      const res = await Like.unlikePost($post_controller.unlike_key);
      $is_liking = false;
      if (res === true) {
        $post_controller.unlike_key = undefined;
      } else {
        $post_controller.is_liked = true;
        $post_controller.stats.likes = $post_controller.stats.likes + 1;
      }
    } else {
      $post_controller.is_liked = true;
      $post_controller.stats.likes = $post_controller.stats.likes + 1;
      const res = await Like.likePost($post_controller.id);
      $is_liking = false;
      if (res.success) {
        $post_controller.unlike_key = res.unlike_key;
      } //else {
      // $App.sheet_id = 'out_of_likes';
      //}
    }

    await reload();
  };

  const quarantineClick = async () => {
    if (!$page.data.my_nametag) {
      $App.sheet_id = 'onboarding';
      return;
    }

    if (!$post_controller.stats) return;

    $is_quarantining = true;

    if ($post_controller.is_quarantined) {
      $post_controller.is_quarantined = false;
      $post_controller.stats.quarantines = $post_controller.stats.quarantines - 1;
      await QuarantineDestroyRequest.post({ post_id: $post_controller.id });
      $is_quarantining = false;
      $button_controller = '';
    } else {
      $post_controller.is_quarantined = true;
      $post_controller.stats.quarantines = $post_controller.stats.quarantines + 1;
      await QuarantineCreateRequest.post({ post_id: $post_controller.id });
      $is_quarantining = false;
      $showing_post = false;
    }

    await reload();
  };

  const showPost = () => {
    $showing_post = true;
  };

  const checkBounds = () => {
    if (wrapper && !_seen) {
      const bounds = wrapper.getBoundingClientRect();
      if (bounds.top < 0) {
        _seen = true;
        dispatch('seen');
      }
    }
  };

  const repliesClick = async () => {
    if ($post_controller && $post_controller.stats) {
      $replies_loading = true;
      await RepliesManager.openReplies(
        $post_controller.id,
        $post_controller.stats.replies
      );
      $replies_loading = false;
    }
  };
</script>

{#if wrapper_mode}
  <slot
    post={$post_controller}
    {post_controller}
    {button_controller}
    {is_my_post}
    {is_liking}
    {is_quarantining}
    {showing_mod_result}
    {showing_post}
    {post_hidden}
    {replies_loading}
    {likeClick}
    {repliesClick}
    {quarantineClick}
  />
{:else if $post_controller !== undefined}
  <div bind:this={wrapper} data-theme={$post_controller.nametag.theme}>
    {#if post_hidden === false}
      <Row
        sticky
        padded
        bordered
        fill={$post_controller.audience === 'close_friends'
          ? 'superlight'
          : 'system-superlight'}
      >
        <div slot="left" data-flex="ac">
          <Nametag nametag={$post_controller.nametag} />
          <div class="half small">
            <Icon icon="arrow_right" />
          </div>
          {#if $post_controller.audience === 'close_friends'}
            <p class="h3 half small">
              <Icon icon="favorite" />
              Close Friends
            </p>
          {:else}
            <p class="h3 half small">
              <Icon icon="signpost" />
              Posts
            </p>
          {/if}
        </div>
        <div slot="right">
          <a
            href={`/post/${$post_controller.id}`}
            class="half"
            data-unstyle
            title={`posted at ${new Date($post_controller.ts / 1000).toString()}`}
          >
            {getTimeAgo(new Date($post_controller.ts / 1000), 'twitter-now')}
          </a>
        </div>
      </Row>
      <Gallery photos={$post_controller.contents[0].photos} />
      <!-- The main post area -->
      <Container
        fill={$post_controller.audience === 'close_friends'
          ? 'light'
          : 'system-light'}
        bottombordered
        padded={false}
      >
        <div data-flex="v">
          <div class="summary-wrapper" data-expanded={$is_expanded} data-padded>
            <div class="summary" data-richtext>
              {@html $post_controller.contents[0].content}
            </div>
            {#if $post_controller.contents.length === 1}
              <div
                class="read-more"
                data-theme={$post_controller.audience === 'close_friends'
                  ? $post_controller.nametag.theme
                  : 'system'}
              >
                <Button
                  small
                  icon={$is_expanded ? 'expand_less' : 'expand_more'}
                  label={$is_expanded ? 'Collapse' : 'Expand'}
                  on:click={() => {
                    $is_expanded = !$is_expanded;
                  }}
                />
              </div>
            {/if}
          </div>
          {#if $post_controller.contents[0].links.length}
            <div>
              <LinkList padded="h">
                {#each $post_controller.contents[0].links as link (link)}
                  <LinkDisplay {link} />
                {/each}
              </LinkList>
            </div>
          {/if}
          {#if $post_controller.contents.length > 1}
            <div data-padded>
              <Button
                small
                label={`Read ${$post_controller.contents.length - 1} more…`}
                href={`/post/${$post_controller.id}`}
              />
            </div>
          {/if}
          {#if $post_controller.stats}
            <div data-padded>
              <Row>
                <PostActionsLeft
                  slot="left"
                  {is_my_post}
                  {post_controller}
                  {is_liking}
                  {showing_mod_result}
                  {replies_loading}
                  {likeClick}
                  {repliesClick}
                />
                <PostActionsRight
                  slot="right"
                  {post_controller}
                  {button_controller}
                  {showing_post}
                  {is_quarantining}
                  {quarantineClick}
                />
              </Row>
            </div>
          {/if}
        </div>
      </Container>
    {:else}
      <Container fill="dark">
        <div class="quarantined" data-flex="ac">
          <div data-flex="v as" data-gap>
            <h2 class="half thin">
              <Icon icon="visibility_off" />
              Post is hidden.
            </h2>
            {#if $post_controller.is_quarantined}
              <h3 class="half">You quarantined it.</h3>
            {/if}
            {#if $post_controller.settings.is_nsfw}
              <h3 class="half">It's NSFW.</h3>
            {/if}
            <div data-flex data-gap>
              <Button label="Tap to show" superdark on:click={showPost} />
              <div>
                {#if $post_controller.settings.is_nsfw}
                  <Button
                    label="Change settings"
                    superdark
                    href="/settings/content"
                  />
                {/if}
              </div>
            </div>
          </div>
        </div>
      </Container>
    {/if}
    <PostModResult {post_controller} {showing_mod_result} {post_hidden} />
  </div>
{:else if $loading_post === true}
  <div data-loading>
    <div data-fill="system-superlight" />
    <p />
    <p />
    <p />
  </div>
{:else}<div />{/if}

<style lang="scss">
  .summary-wrapper {
    position: relative;
    overflow: hidden;
    // padding-bottom: 34px;

    .summary {
      font-size: 1.125rem;
      display: -webkit-box;
      max-height: 108px;
      overflow: hidden;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
    }

    .read-more {
      position: absolute;
      padding-left: 1px;
      width: 100%;
      height: 34px;
      top: 96px;
      background: linear-gradient(0deg, rgb(var(--light)), rgba(var(--light), 0.85));
    }

    &[data-expanded='true'] {
      .summary {
        max-height: none;
        -webkit-line-clamp: 1000;
      }

      .read-more {
        position: static;
      }
    }
  }

  .quarantined {
    min-height: 220px;
  }
</style>
