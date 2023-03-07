<script lang="ts">
  import { page } from '$app/stores';
  import { Like } from '$lib/api/like/like';
  import { LoadPostRequest } from '$lib/api/post/load';
  import { QuarantineCreateRequest } from '$lib/api/quarantine/create';
  import { QuarantineDestroyRequest } from '$lib/api/quarantine/destroy';
  import { App } from '$lib/stores/app';
  import { getTimeAgo } from '$lib/util/time-ago';
  import type { ServerPost } from '$lib/zod/Post';
  import { afterUpdate, createEventDispatcher, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import Button from './Button.svelte';
  import ButtonRow from './ButtonRow.svelte';
  import Container from './Container.svelte';
  import Icon from './Icon.svelte';
  import Nametag from './Nametag.svelte';
  import Row from './Row.svelte';

  export let post_id: string | undefined = undefined;
  export let post: ServerPost | undefined = undefined;

  let wrapper: HTMLDivElement | undefined;

  const dispatch = createEventDispatcher();
  let _seen = false;

  const post_controller = writable(post);
  const button_controller = writable('');
  const is_liking = writable(false);
  const is_quarantining = writable(false);
  const showing_post = writable(false);
  const loading_post = writable(false);

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

  afterUpdate(() => {
    console.log('> Post.afterUpdate()');
  });

  const reload = async () => {
    const id = post ? post.id : post_id ? post_id : undefined;

    if (id) {
      const post = await LoadPostRequest.reload(id);
      if (post) $post_controller = post;
    }
  };

  const likeClick = async () => {
    if (!$post_controller.stats) return;

    $is_liking = true;

    if ($post_controller.is_liked && $post_controller.unlike_key) {
      $post_controller.stats.likes = $post_controller.stats.likes - 1;
      $post_controller.is_liked = false;
      await Like.unlikePost($post_controller.unlike_key);
      $is_liking = false;
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
    if (!$post_controller.stats) return;

    $is_quarantining = true;

    if ($post_controller.is_quarantined) {
      $post_controller.is_quarantined = false;
      $post_controller.stats.quarantines = $post_controller.stats.quarantines - 1;
      await QuarantineDestroyRequest.post({ post_id: $post_controller.id });
      $is_quarantining = false;
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
</script>

<svelte:window on:scroll={checkBounds} />

{#if $post_controller !== undefined}
  <div bind:this={wrapper} data-post={$post_controller.id}>
    <Row sticky padded bordered fill="system-superlight">
      <div slot="left">
        <Nametag small nametag={$post_controller.nametag} />
      </div>
      <div slot="right">
        <a
          href={`/post/${$post_controller.id}`}
          class="half"
          data-unstyle
          title={`posted at ${new Date($post_controller.ts / 1000).toString()}`}
        >
          {getTimeAgo(new Date($post_controller.ts / 1000), 'mini')}
        </a>
      </div>
    </Row>
    {#if post_hidden === false}
      <Container fill="system-light">
        <div data-flex="v" data-gap="1">
          <div class="summary">
            {@html $post_controller.contents[0].content}
          </div>
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
                <!-- <Button
                id="replies"
                icon="reply"
                count={$post_controller.stats.replies}
              /> -->
              </ButtonRow>
              <ButtonRow slot="right" initial="hide">
                {#if $post_controller.is_quarantined}
                  <Button
                    controller={button_controller}
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
                  disabled={$is_quarantining}
                  count={$post_controller.stats.quarantines}
                  small
                  primary={$post_controller.is_quarantined}
                  label=""
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
    {#if is_my_post && $post_controller?.settings?.mod_result?.allow_likes === false && post_hidden === false}
      <Container fill="superlight">
        <div data-flex="v as" data-gap>
          <div>
            <h3>Heads up!</h3>
            <p>
              Your post failed our automatic checks, so likes have been turned off.
              Think we got it wrong? <Button
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
            </p>
          </div>
          <small class="half">
            <Icon icon="visibility_off" /> Only you can see this.
          </small>
        </div>
      </Container>
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
  .summary {
    display: -webkit-box;
    max-height: 4.5rem;
    overflow: hidden;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .quarantined {
    min-height: 220px;
  }
</style>
