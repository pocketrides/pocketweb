<script lang="ts">
  import { browser } from '$app/environment';
  import { invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import { ReplyToPostRequest } from '$lib/api/reply/reply_to_post';
  import { Room, type RoomConnection } from '$lib/api/room';
  import Gallery from '$lib/components/Gallery.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import LinkDisplay from '$lib/components/LinkDisplay.svelte';
  import LinkList from '$lib/components/LinkList.svelte';
  import Main from '$lib/components/Main.svelte';
  import MessageComposer from '$lib/components/messaging/MessageComposer.svelte';
  import Nametag from '$lib/components/Nametag.svelte';
  import Post from '$lib/components/Post.svelte';
  import PostActionsLeft from '$lib/components/PostActionsLeft.svelte';
  import PostActionsRight from '$lib/components/PostActionsRight.svelte';
  import PostModResult from '$lib/components/PostModResult.svelte';
  import Replies from '$lib/components/replies/Replies.svelte';
  import Row from '$lib/components/Row.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import UtilityNav from '$lib/components/UtilityNav.svelte';
  import { App } from '$lib/stores/app';
  import { RepliesManager, RepliesManagerStore } from '$lib/stores/replies';
  import { getThumbnail } from '$lib/util/cloudinary';
  import { scrollToEnhanced } from '$lib/util/scroll-to';
  import { getTimeAgo } from '$lib/util/time-ago';
  import type { MessageComposerEvent } from '$lib/zod/Message';
  import type { ClientReply } from '$lib/zod/Reply';
  import { afterUpdate, onDestroy, onMount, tick } from 'svelte';
  import type { PageData } from './$types';
  import { formatWorldfeedLocation, getWorldfeedLink } from '$lib/util/worldfeed';

  export let data: PageData;

  $: $App.theme = data.post.nametag.theme;
  $: $App.fill = 'white';
  // data.post.audience === 'close_friends' ? 'superlight' : 'system-superlight';

  let current_post_id = data.post.id;
  let room: RoomConnection | undefined;
  let page_title = data.post.contents[0].content_raw;
  if (page_title.length > 40) page_title = page_title.substring(0, 40) + '…';
  let replies_wrapper: HTMLDivElement;
  let reconnect_count = 0;
  let has_first_image = data.post.contents[0].photos[0];
  let og_image = has_first_image
    ? getThumbnail(has_first_image.version, has_first_image.public_id)
    : undefined;

  onMount(async () => {
    if (browser && data.post.settings.enable_replies) {
      // get around stupid sveltekit
      // console warning bc we load this at the same time
      await tick();

      await Promise.all([
        RepliesManager.loadReplies(data.post.id, data.post.stats!.replies),
        connect()
      ]);
    }

    if (new URLSearchParams(location.search).has('ok')) {
      history.replaceState({}, '', location.toString().replace('?ok=1', ''));
    }
  });

  afterUpdate(async () => {
    if (current_post_id !== data.post.id) {
      location.reload();
    }
  });

  onDestroy(() => {
    if (data.post.settings.enable_replies) {
      disconnect();
      $RepliesManagerStore.replies = [];
    }
  });

  const connect = async () => {
    room = await Room.connect('post', data.post.id, $page.data.room_key);

    room?.handleMessage((msg) => {
      RepliesManagerStore.update((prev) => {
        if (prev.replies) prev.replies.push(msg as ClientReply);
        else prev.replies = [msg as ClientReply];
        return prev;
      });
    });

    room?.handleNewCount((new_count: number) => {
      $RepliesManagerStore.latest_count = new_count;
    });

    room?.handleEarlyDisconnect(() => {
      reconnect_count++;

      if (reconnect_count > 3) return;

      setTimeout(async () => {
        disconnect();
        connect();
      }, 2000);
    });
  };

  const disconnect = () => {
    room?.disconnect();
    room = undefined;
  };

  const repliesClick = () => {
    if (replies_wrapper) {
      replies_wrapper.querySelector('textarea')?.focus();
    }
  };

  const handleReply = async (e: CustomEvent<MessageComposerEvent>) => {
    let res = await ReplyToPostRequest.post({
      post_id: data.post.id,
      messages: e.detail.messages
    });

    if (res.success) {
      e.detail.completeCallback(true);

      RepliesManagerStore.update((prev) => {
        if (prev.replies && res.success) {
          res.reply.pending = true;
          prev.replies.push(res.reply);
          prev.latest_count = res.new_count;
        } else if (!prev.replies && res.success) {
          res.reply.pending = true;
          prev.replies = [res.reply];
          prev.latest_count = res.new_count;
        }

        return prev;
      });

      room?.updateCount(res.new_count);
      room?.sendMessage(res.reply, $page.data.room_key);

      scrollToBottom();
    } else {
      e.detail.completeCallback(false);
    }
  };

  const scrollToBottom = () => {
    const scroll_target = document.querySelector(
      '[data-message-composer]'
    ) as HTMLElement;

    if (scroll_target) {
      scrollToEnhanced(() => {
        window.scrollTo(
          0,
          scroll_target.offsetTop +
            scroll_target.offsetHeight +
            (window.innerWidth >= 640 ? 68 : 0) -
            (window.visualViewport?.height || window.innerHeight)
        );
      });
    }
  };
</script>

<svelte:head>
  <title>a post by {data.post.nametag.nametag} | on pocketrides!</title>
  {#if og_image}
    <meta property="og:image" content={og_image} />
  {/if}
  <meta
    property="og:title"
    content={`a post by ${data.post.nametag.nametag} on pocketrides!`}
  />
  <meta property="og:description" content={page_title} />
  <meta name="description" content={page_title} />
</svelte:head>

<SiteHeader
  huddable
  fill={data.post.audience === 'close_friends' ? 'light' : 'system-light'}
>
  <Gallery slot="gallery" photos={data.post.contents[0].photos} square={false} />
</SiteHeader>

<Post
  post={data.post}
  wrapper_mode
  let:post
  let:post_controller
  let:likeClick
  let:button_controller
  let:is_liking
  let:is_my_post
  let:is_quarantining
  let:quarantineClick
  let:showing_mod_result
  let:showing_post
  let:post_hidden
  let:replies_loading
>
  <Main fullheight padded={false} fill="white">
    <div class="post-outer">
      <Row
        padded
        fill={post.audience === 'close_friends' ? 'superlight' : 'system-superlight'}
        sticky
        bordered
      >
        <div slot="left" data-flex="ac">
          <Nametag nametag={post.nametag} />
          <div class="half small">
            <Icon icon="arrow_right" />
          </div>
          {#if post.audience === 'close_friends'}
            <p class="h3 half small">
              <Icon icon="favorite" filled />
              Close Friends
            </p>
          {:else if post.audience === 'pocket' && post.pocket_ref}
            <a
              href={`/pocket/${post.pocket_ref.id}`}
              data-unstyle
              class="h3 half small nowraps"
            >
              <Icon icon="hail" />
              {post.pocket_name || 'Pocket'}
            </a>
          {:else}
            <a
              href={`/profile/${post.nametag.id}`}
              class="h3 half small"
              data-unstyle
            >
              <Icon icon="signpost" />
              Posts
            </a>
          {/if}
        </div>
        <h3 slot="right" class="half h3 small">
          {getTimeAgo(new Date(post.ts / 1000), 'twitter')}
        </h3>
      </Row>
      <div class="post-wrapper" data-fill="system-light">
        {#each post.contents as content, index (content)}
          <div>
            {#if index > 0}
              <Gallery photos={content.photos} square={false} />
            {/if}
            <div data-richtext data-padded>
              {@html content.content}
            </div>
            {#if content.links.length}
              <LinkList padded>
                {#each content.links as link (link)}
                  <LinkDisplay {link} />
                {/each}
              </LinkList>
            {/if}
          </div>
          {#if index === 0}
            <PostModResult {post_controller} {showing_mod_result} {post_hidden} />
          {/if}
        {/each}
      </div>
      {#if post.settings.worldfeed}
        <div class="wf-wrapper" data-flex="as">
          <a
            href={getWorldfeedLink(post.settings.worldfeed)}
            data-unstyle
            class="h3 half small"
          >
            <Icon icon="public" />
            {formatWorldfeedLocation(post.settings.worldfeed)}
          </a>
        </div>
      {/if}
    </div>
    {#if data.post.settings.enable_replies}
      <div class="replies-outer">
        <Row padded fill="system-superlight" bordered>
          <div slot="left" data-flex="ac">
            <h3>
              <Icon icon="reply" />
              Replies
            </h3>
          </div>
        </Row>
        <div
          class="replies-wrapper"
          data-flex="v"
          data-gap
          bind:this={replies_wrapper}
        >
          <Replies />
        </div>
      </div>
      <div class="mc-outer">
        <MessageComposer
          placeholder="Write a reply…"
          on:message={handleReply}
          on:active={scrollToBottom}
        />
      </div>
    {/if}
    <UtilityNav slot="utility-nav">
      <PostActionsLeft
        slot="left"
        {post_controller}
        {is_my_post}
        {is_liking}
        {likeClick}
        {repliesClick}
        {replies_loading}
        {showing_mod_result}
      />
      <PostActionsRight
        slot="right"
        {post_controller}
        {button_controller}
        {showing_post}
        {is_quarantining}
        {quarantineClick}
      />
    </UtilityNav>
  </Main>
</Post>

<style lang="scss">
  [data-richtext] {
    font-size: 1.125rem;
  }

  @media (min-width: 640px) {
    .post-outer,
    .replies-outer {
      margin: 1rem 0;
      overflow: hidden;
      border-radius: 0.5rem;
      border: 1px solid rgba(var(--dark), 0.25);
    }
  }

  .replies-wrapper {
    padding-bottom: 1rem;

    padding-top: 0.5rem;
  }

  .mc-outer {
    padding-bottom: 1rem;
  }

  .wf-wrapper {
    padding: 0 1rem 0.5rem;
  }
</style>
