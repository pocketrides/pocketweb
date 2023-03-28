<script lang="ts">
  import { page } from '$app/stores';
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import EnableNotifications from '$lib/sheets/EnableNotifications.svelte';
  import { App } from '$lib/stores/app';
  import DefaultUtilityNav from '$lib/utility-navs/DefaultUtilityNav.svelte';
  import { afterUpdate, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import type { PageData } from './$types';
  import ProfileHeader from './ui/ProfileHeader.svelte';
  import ProfileUtilityNav from './ui/ProfileUtilityNav.svelte';
  import ScrollList from '$lib/components/ScrollList.svelte';
  import Post from '$lib/components/Post.svelte';
  import Row from '$lib/components/Row.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import CreateContentUtilityNav from '$lib/utility-navs/CreateContentUtilityNav.svelte';
  import { LoadNametagFeedRequest } from '$lib/api/feed/nametag';
  import ProfileFreeModeHeader from './ui/ProfileFreeModeHeader.svelte';
  import { getSquare } from '$lib/util/cloudinary';

  $App.fill = 'system-superlight';

  export let data: PageData;

  $App.theme = data.page_nametag.theme;

  const page_controller = writable(data);

  let has_pic = data.page_nametag.profile_pic;
  let og_image = has_pic ? getSquare(has_pic.version, has_pic.public_id) : undefined;

  onMount(() => {
    if (new URLSearchParams(location.search).has('subscribed')) {
      // $App.sheet_id = 'enable-notifications';
      history.replaceState({}, '', location.toString().replace('?subscribed=1', ''));
    }
  });

  afterUpdate(() => {
    $page_controller = data;
  });

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

<svelte:head>
  <title>{data.page_nametag.nametag} is on pocketrides!</title>
  {#if og_image}
    <meta property="og:image" content={og_image} />
  {/if}
  <meta
    property="og:title"
    content={`${data.page_nametag.nametag} is on pocketrides!`}
  />
</svelte:head>

<SiteHeader outer_fill="system-light">
  <ProfileHeader {page_controller} />
</SiteHeader>
<Main fullheight padded={false} fill="system-light">
  {#if $page_controller.is_my_profile_page && $page.data.my_nametag?.stripe?.free_mode}
    <ProfileFreeModeHeader />
  {:else}
    <Row padded bordered fill="system-light">
      <h2 slot="left">
        <Icon icon="signpost" />
        Posts
      </h2>
    </Row>
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
  <svelte:fragment slot="utility-nav">
    {#if $page.data.my_nametag}
      {#if $page_controller.is_my_profile_page === false}
        <ProfileUtilityNav {page_controller} />
      {:else}
        <CreateContentUtilityNav />
      {/if}
    {:else}
      <DefaultUtilityNav />
    {/if}
  </svelte:fragment>
</Main>
<EnableNotifications />
