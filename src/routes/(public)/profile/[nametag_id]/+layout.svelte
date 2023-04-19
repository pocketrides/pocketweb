<script lang="ts">
  import { page } from '$app/stores';
  import EnableNotifications from '$lib/sheets/EnableNotifications.svelte';
  import CreateContentUtilityNav from '$lib/utility-navs/CreateContentUtilityNav.svelte';
  import DefaultUtilityNav from '$lib/utility-navs/DefaultUtilityNav.svelte';
  import { writable } from 'svelte/store';
  import type { LayoutData } from './$types';
  import ProfileFollowersList from './ui/ProfileFollowersList.svelte';
  import ProfileFriendsList from './ui/ProfileFriendsList.svelte';
  import ProfileUtilityNav from './ui/ProfileUtilityNav.svelte';
  import ProfileHeader from './ui/ProfileHeader.svelte';
  import { getSquare } from '$lib/util/cloudinary';
  import { onMount } from 'svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import ProfileNav from './ui/ProfileNav.svelte';
  import { App } from '$lib/stores/app';
  import { nav_items } from './ui/nav_items';
  import { afterNavigate } from '$app/navigation';
  import { browser } from '$app/environment';
  import Scrollable from '$lib/components/Scrollable.svelte';
  import ScrollableItem from '$lib/components/ScrollableItem.svelte';
  import Main from '$lib/components/Main.svelte';
  import Container from '$lib/components/Container.svelte';

  export let data: LayoutData;

  const page_controller = writable(data);

  $App.fill = 'system-superlight';

  $: $page_controller = data;

  $: $App.theme = $page_controller.page_nametag.theme;
  $: has_pic = data.page_nametag.profile_pic;
  $: og_image = has_pic ? getSquare(has_pic.version, has_pic.public_id) : undefined;

  let slot: HTMLDivElement;

  const itemActive = (e: CustomEvent) => {
    const id = e.detail.id as string;
    document.getElementById(id)?.click();
  };

  const sync = () => {
    if (slot && slot.parentElement) {
      slot.parentElement.scrollTo(
        slot.offsetLeft - slot.parentElement!.offsetLeft,
        0
      );
    }
  };

  onMount(() => {
    if (new URLSearchParams(location.search).has('subscribed')) {
      // $App.sheet_id = 'enable-notifications';
      history.replaceState({}, '', location.toString().replace('?subscribed=1', ''));
    }

    if (browser) sync();
  });

  afterNavigate(() => {
    sync();
  });
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

<SiteHeader huddable>
  <Container>
    <ProfileHeader {page_controller} />
  </Container>
  <ProfileNav slot="nav" {page_controller} />
</SiteHeader>

<Main fullheight padded={false} fill="system-light">
  <slot />
</Main>

{#if $page.data.my_nametag}
  {#if $page_controller.is_my_profile_page === false}
    <ProfileUtilityNav {page_controller} />
  {:else}
    <CreateContentUtilityNav />
  {/if}
{:else}
  <DefaultUtilityNav />
{/if}
<EnableNotifications />
<ProfileFriendsList />
<ProfileFollowersList />
