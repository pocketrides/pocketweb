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
  import { Notifications } from '$lib/stores/notifications';

  export let data: LayoutData;

  let dispose: Function;

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
      const store = new NotificationStore();
      await store.fetch({});

      $Notifications.unread_count = store.unreadCount;
      $Notifications.items = store.notifications;

      dispose = client.startRealTimeListener();

      pushEventAggregator.on('notifications.new', async () => {
        await store.fetch({});
        $Notifications.unread_count = store.unreadCount;
        $Notifications.items = store.notifications;
      });
    }
  });

  onDestroy(async () => {
    if (dispose) dispose();
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
