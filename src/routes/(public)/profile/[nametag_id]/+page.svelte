<script lang="ts">
  import { page } from '$app/stores';
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import EnableNotifications from '$lib/sheets/EnableNotifications.svelte';
  import { App } from '$lib/stores/app';
  import DefaultUtilityNav from '$lib/utility-navs/DefaultUtilityNav.svelte';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import type { PageData } from './$types';
  import ProfileHeader from './ui/ProfileHeader.svelte';
  import ProfileUtilityNav from './ui/ProfileUtilityNav.svelte';

  export let data: PageData;

  $: page_controller = writable(data);

  onMount(() => {
    if (new URLSearchParams(location.search).has('subscribed')) {
      // $App.sheet_id = 'enable-notifications';
      history.replaceState({}, '', location.toString().replace('?subscribed=1', ''));
    }
  });

  $App.fill = 'system-superlight';
</script>

<svelte:head>
  <title>{data.page_nametag.nametag} is on pocketrides!</title>
</svelte:head>

<SiteHeader>
  <ProfileHeader {page_controller} />
</SiteHeader>
<Main>
  <svelte:fragment slot="utility-nav">
    {#if $page.data.my_nametag}
      {#if $page.data.my_nametag.id !== $page.data.page_nametag?.id}
        <ProfileUtilityNav {page_controller} />
      {/if}
    {:else}
      <DefaultUtilityNav />
    {/if}
  </svelte:fragment>
</Main>
<EnableNotifications />
