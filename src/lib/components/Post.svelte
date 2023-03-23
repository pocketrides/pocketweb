<script lang="ts">
  import { page } from '$app/stores';
  import { Like } from '$lib/api/like/like';
  import { LoadPostRequest } from '$lib/api/post/load';
  import { QuarantineCreateRequest } from '$lib/api/quarantine/create';
  import { QuarantineDestroyRequest } from '$lib/api/quarantine/destroy';
  import { App } from '$lib/stores/app';
  import { RepliesManager } from '$lib/stores/RepliesManager';
  import { getTimeAgo } from '$lib/util/time-ago';
  import type { ServerPost } from '$lib/zod/Post';
  import { afterUpdate, createEventDispatcher, onMount } from 'svelte';
  import { each } from 'svelte/internal';
  import { writable } from 'svelte/store';
  import { slide } from 'svelte/transition';
  import Button from './Button.svelte';
  import ButtonRow from './ButtonRow.svelte';
  import CloudinaryImg from './CloudinaryImg.svelte';
  import Container from './Container.svelte';
  import Gallery from './Gallery.svelte';
  import Icon from './Icon.svelte';
  import Nametag from './Nametag.svelte';
  import Replies from './replies/Replies.svelte';
  import Row from './Row.svelte';

  export let post_id: string | undefined = undefined;
  export let post: ServerPost | undefined = undefined;

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

  $: should_be_hidden = $post_controller
    ? $post_controller.is_quarantined || $post_controller.settings.is_nsfw
    : false;
  $: post_hidden = should_be_hidden && $showing_post === false;
  $: is_my_post = $page.data.my_nametag?.id === $post_controller?.nametag?.id;

  onMount(async () => {
    try {
      if (post_id) {
        $loading_post = true;
        const post = await LoadPostRequest.load(post_id);
        if (post) {
          $post_controller = post;
          $loading_post = false;
        } else {
          $loading_post = false;
        }
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
      if (bounds.bottom < 0) {
        _seen = true;
        dispatch('seen');
      }
    }
  };

  const openReplies = () => {
    RepliesManager.openReplies(post_id, $post_controller.replies);
  };
</script>

<svelte:window on:scroll={checkBounds} />

{#if $post_controller !== undefined}
  <div
    bind:this={wrapper}
    data-post={$post_controller.id}
    data-theme={$post_controller.nametag.theme}
  >
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
      >
        <div data-flex="v" data-gap="1">
          <div class="summary-wrapper" data-expanded={$is_expanded}>
            <div class="summary" data-richtext>
              {@html $post_controller.contents[0].content}
            </div>
            <div class="read-more">
              {#if $post_controller.contents.length === 1}
                <Button
                  small
                  icon={$is_expanded ? 'expand_less' : 'expand_more'}
                  label={$is_expanded ? 'Collapse' : 'Expand'}
                  on:click={() => {
                    $is_expanded = !$is_expanded;
                  }}
                />
              {/if}
            </div>
          </div>
          {#if $post_controller.contents.length > 1}
            <div>
              <Button
                small
                label={`Read ${$post_controller.contents.length - 1} more…`}
                href={`/post/${$post_controller.id}`}
              />
            </div>
          {/if}
          {#if $post_controller.stats}
            <Row>
              <ButtonRow slot="left">
                {#if $post_controller.settings.enable_likes === true}
                  <Button
                    id="likes"
                    icon="favorite_border"
                    disabled={$is_liking}
                    small
                    primary={$post_controller.is_liked}
                    count={$post_controller.stats.likes}
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
                    icon="reply"
                    small
                    label=""
                    count={$post_controller.stats.replies}
                    on:click={openReplies}
                  />
                {/if}
              </ButtonRow>
              <ButtonRow slot="right">
                {#if $post_controller.is_quarantined}
                  <Button
                    controller={button_controller}
                    small
                    id="hide"
                    icon="visibility_off"
                    label="Hide post"
                    on:click={() => {
                      $showing_post = false;
                    }}
                  />
                {/if}
                <Button
                  id="quarantines"
                  icon="support"
                  small
                  disabled={$is_quarantining}
                  controller={button_controller}
                  count={$post_controller.stats.quarantines}
                  primary={$post_controller.is_quarantined}
                  label={$post_controller.is_quarantined
                    ? 'Unquarantine'
                    : 'Quarantine'}
                  on:click={quarantineClick}
                />
              </ButtonRow>
            </Row>
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
            <h3 class="half">You quarantined it.</h3>
            <Button label="Tap to show" superdark on:click={showPost} />
          </div>
        </div>
      </Container>
    {/if}
    {#if post_hidden === false && $showing_mod_result}
      <div in:slide|local out:slide|local>
        <Container fill="superlight">
          <div data-flex="v as" data-gap="1">
            <div data-flex="v as" data-gap>
              <h3>
                <Icon icon="info" />
                Heads up!
              </h3>
              <p>
                Your post failed our automatic checks, so likes have been turned off.
                Think we got it wrong? Tap Dispute and we'll review it.
              </p>
              <Button
                small
                label="Dispute"
                on:click={() => {
                  window.open(
                    `mailto:hello@pocketrides.cc?subject=dispute&body=` +
                      encodeURIComponent(
                        `Hello, I think my post was incorrectly moderated. It says:\n\n\t\t${$post_controller.contents[0].content_raw}\n\nThe moderator said the following:\n\n\t\t${$post_controller.settings.mod_result?.response_text}\n\nLink to the post: https://pocketrides.com/post/${$post_controller.id}\n\nThanks!`
                      )
                  );
                }}
              />
            </div>
            <small class="half">
              <Icon icon="visibility_off" /> Only you can see this.
            </small>
          </div>
        </Container>
      </div>
    {/if}
  </div>
{:else if $loading_post === true}
  <div data-loading>
    <div data-fill="system-superlight" />
    <div />
    <p />
    <p />
    <p />
  </div>
{:else}<div />{/if}

<style lang="scss">
  .summary-wrapper {
    position: relative;
    overflow: hidden;
    padding-bottom: 34px;

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
      top: 108px;
      background: linear-gradient(0deg, rgb(var(--light)), rgba(var(--light), 0.85));
    }

    &[data-expanded='true'] {
      padding-bottom: 0;

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
