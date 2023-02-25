<script lang="ts">
  import { page } from '$app/stores';
  import { LikeCreateRequest } from '$lib/api/like/create';
  import { LikeDestroyRequest } from '$lib/api/like/destroy';
  import { LoadPostRequest } from '$lib/api/post/load';
  import { QuarantineCreateRequest } from '$lib/api/quarantine/create';
  import { QuarantineDestroyRequest } from '$lib/api/quarantine/destroy';
  import { App } from '$lib/stores/app';
  import { plural } from '$lib/util/plural';
  import { getTimeAgo } from '$lib/util/time-ago';
  import type { ServerPost } from '$lib/zod/Post';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import Button from './Button.svelte';
  import ButtonRow from './ButtonRow.svelte';
  import Container from './Container.svelte';
  import Icon from './Icon.svelte';
  import Nametag from './Nametag.svelte';
  import Replies from './Replies.svelte';
  import Row from './Row.svelte';

  export let post_id: string | undefined = undefined;
  export let post: ServerPost | undefined = undefined;

  const post_controller = writable(post);
  const button_controller = writable('');
  const is_liking = writable(false);
  const is_quarantining = writable(false);
  const showing_post = writable(false);

  $: should_be_hidden = $post_controller
    ? $post_controller.is_quarantined || $post_controller.settings.is_nsfw
    : false;
  $: post_hidden = should_be_hidden && $showing_post === false;
  $: is_my_post = $page.data.my_nametag?.id === $post_controller?.nametag?.id;

  onMount(async () => {
    if (post_id) {
      const post = await LoadPostRequest.load(post_id);
      if (post) {
        $post_controller = post;
      }
    }
  });

  const likeClick = async () => {
    $is_liking = true;

    if ($post_controller.is_liked) {
      await LikeDestroyRequest.post({ post_id: $post_controller.id });
      $post_controller.stats.likes = $post_controller.stats.likes - 1;
      $post_controller.is_liked = false;
      $is_liking = false;
    } else {
      const res = await LikeCreateRequest.post({ post_id: $post_controller.id });
      if (res.success) {
        $post_controller.is_liked = true;
        $post_controller.stats.likes = $post_controller.stats.likes + 1;
        $is_liking = false;
      } else {
        $App.sheet_id = 'out_of_likes';
        $is_liking = false;
      }
    }
  };

  const quarantineClick = async () => {
    $is_quarantining = true;

    if ($post_controller.is_quarantined) {
      await QuarantineDestroyRequest.post({ post_id: $post_controller.id });
      $post_controller.is_quarantined = false;
      $post_controller.stats.quarantines = $post_controller.stats.quarantines - 1;
      $is_quarantining = false;
    } else {
      await QuarantineCreateRequest.post({ post_id: $post_controller.id });
      $post_controller.is_quarantined = true;
      $post_controller.stats.quarantines = $post_controller.stats.quarantines + 1;
      $is_quarantining = false;
      $showing_post = false;
    }
  };

  const showPost = () => {
    $showing_post = true;
  };
</script>

{#if $post_controller !== undefined}
  <div>
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
          <Row>
            <ButtonRow slot="left">
              {#if $post_controller.settings.enable_likes === true}
                <Button
                  controller={button_controller}
                  id="likes"
                  icon="favorite_border"
                  disabled={$is_liking}
                  small
                  primary={$post_controller.is_liked}
                  count={$post_controller.stats.likes}
                  label={plural(
                    $post_controller.stats.likes,
                    'like',
                    'likes',
                    false
                  )}
                  on:click={likeClick}
                />
              {/if}
              <Button
                controller={button_controller}
                id="replies"
                icon="reply"
                count={$post_controller.stats.replies}
                label={plural(
                  $post_controller.stats.replies,
                  'reply',
                  'replies',
                  false
                )}
              />
            </ButtonRow>
            <ButtonRow slot="right">
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
                controller={button_controller}
                id="quarantines"
                icon="support"
                disabled={$is_quarantining}
                count={$post_controller.stats.quarantines}
                small
                primary={$post_controller.is_quarantined}
                label={plural(
                  $post_controller.stats.quarantines,
                  'quarantine',
                  'quarantines',
                  false
                )}
                on:click={quarantineClick}
              />
            </ButtonRow>
          </Row>
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
    {#if is_my_post && $post_controller?.settings?.mod_result?.allow_likes === false}
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
{:else}
  <div data-loading>
    <div data-fill="system-superlight" />
    <div />
    <p />
    <p />
    <p />
  </div>
{/if}

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
    aspect-ratio: 16 / 9;
  }
</style>
