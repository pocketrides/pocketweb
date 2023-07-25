<script lang="ts">
  import { page } from '$app/stores';
  import EnableNotifications from '$lib/sheets/EnableNotifications.svelte';
  import CreateContentUtilityNav from '$lib/utility-navs/CreateContentUtilityNav.svelte';
  import DefaultUtilityNav from '$lib/utility-navs/DefaultUtilityNav.svelte';
  import { writable } from 'svelte/store';
  import type { LayoutData } from './$types';
  import ProfileFollowersList from './ui/ProfileFollowersList.svelte';
  import ProfileFriendsList from './ui/ProfileFriendsList.svelte';
  import ProfileUtilityNav from './ui/ProfileActions.svelte';
  import ProfileHeader from './ui/ProfileHeader.svelte';
  import { getSquare } from '$lib/util/cloudinary';
  import { onMount } from 'svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import ProfileNav from './ui/ProfileNav.svelte';
  import { App } from '$lib/stores/app';
  import Main from '$lib/components/Main.svelte';
  import Container from '$lib/components/Container.svelte';
  import ProfilePicUpload from './ui/ProfilePicUpload.svelte';
  import ProfilePic from './ui/ProfilePic.svelte';
  import ProfileActions from './ui/ProfileActions.svelte';
  import Nametag from '$lib/components/Nametag.svelte';

  export let data: LayoutData;

  const page_controller = writable(data);

  // $App.fill = 'system-light';

  $: $page_controller = data;

  $: $App.theme = $page_controller.page_nametag.theme;
  $: has_pic = data.page_nametag.profile_pic;
  $: og_image = has_pic ? getSquare(has_pic.version, has_pic.public_id) : undefined;

  onMount(() => {
    if (new URLSearchParams(location.search).has('subscribed')) {
      // $App.sheet_id = 'enable-notifications';
      history.replaceState({}, '', location.toString().replace('?subscribed=1', ''));
    }
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
  <Container slot="gallery" padded={false} padding_override="ht">
    <div class="profile-pic">
      {#if $page_controller.is_my_profile_page}
        <ProfilePicUpload profile_pic={$page.data.my_nametag?.profile_pic} />
      {:else}
        <ProfilePic profile_pic={$page_controller.page_nametag.profile_pic} />
      {/if}
    </div>
  </Container>
  <Nametag nametag={$page_controller.page_nametag} slot="left" />
  <ProfileActions {page_controller} slot="right" />
  <ProfileNav slot="nav" {page_controller} />
  <ProfileHeader {page_controller} />
</SiteHeader>

<Main padded={false}>
  <slot />
</Main>

<!-- {#if $page.data.my_nametag}
  {#if $page_controller.is_my_profile_page === false}
    <ProfileUtilityNav {page_controller} />
  {:else}
    <CreateContentUtilityNav />
  {/if}
{:else}
  <DefaultUtilityNav />
{/if} -->
<EnableNotifications />
<ProfileFriendsList />
<ProfileFollowersList />

<style lang="scss">
  .profile-pic {
    margin-top: env(safe-area-inset-top);
  }
</style>
