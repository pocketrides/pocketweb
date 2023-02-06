<script lang="ts">
  import { browser } from '$app/environment';
  import { afterNavigate, beforeNavigate } from '$app/navigation';
  import { page } from '$app/stores';
  import SiteFooter from '$lib/components/SiteFooter.svelte';
  import SiteLoader from '$lib/components/SiteLoader.svelte';
  import Onboarding from '$lib/sheets/Onboarding.svelte';
  import { App } from '$lib/stores/app';
  import '$lib/styles/global.scss';
  import type { LayoutData } from './$types';
  import MagicBellClient, {
    NotificationStore,
    pushEventAggregator
  } from '@magicbell/core';
  import { onDestroy, onMount } from 'svelte';
  import { Notifications, reloadNotifications } from '$lib/stores/notifications';
  import MyNotifications from '$lib/sheets/MyNotifications.svelte';

  export let data: LayoutData;

  let dispose: Function | undefined;

  $: if (browser) {
    document.documentElement.setAttribute(
      'data-theme',
      $page.data.page_theme || $App.theme
    );
    document.documentElement.setAttribute('data-fill', $App.fill);
    document.documentElement.setAttribute(
      'data-locked',
      $App.sheet_id === '' ? 'false' : 'true'
    );
  }

  onMount(async () => {
    if (browser && data.mb_config) {
      const client = await MagicBellClient.createInstance(data.mb_config);
      $Notifications.instance = new NotificationStore();

      await reloadNotifications();

      dispose = client.startRealTimeListener();

      pushEventAggregator.on('notifications.new', reloadNotifications);
      pushEventAggregator.on('notifications.read.all', reloadNotifications);
      pushEventAggregator.on('notifications.delete', reloadNotifications);
    }
  });

  onDestroy(async () => {
    if (dispose) {
      dispose();
      dispose = undefined;
    }
  });

  beforeNavigate(async () => {
    $App.loading = true;

    setTimeout(() => {
      $App.loading = false;
    }, 2000);
  });

  afterNavigate(() => {
    $App.loading = false;
  });
</script>

<slot />
<SiteFooter />
<SiteLoader />
<Onboarding />
{#if $page.data.my_nametag}
  <MyNotifications />
{/if}
