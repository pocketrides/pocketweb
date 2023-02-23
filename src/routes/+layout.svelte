<script lang="ts">
  import '$lib/styles/global.scss';

  import { browser } from '$app/environment';
  import { afterNavigate, beforeNavigate } from '$app/navigation';
  import { page } from '$app/stores';
  import SiteFooter from '$lib/components/SiteFooter.svelte';
  import SiteLoader from '$lib/components/SiteLoader.svelte';
  import Onboarding from '$lib/sheets/Onboarding.svelte';
  import { App } from '$lib/stores/app';
  import { afterUpdate, onDestroy } from 'svelte';
  import { Notifications, reloadNotifications } from '$lib/stores/notifications';
  import MyNotifications from '$lib/sheets/MyNotifications.svelte';
  import type MagicBellClient from '@magicbell/core';

  let started: boolean = false;
  let client: MagicBellClient;
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

  // boots up MagicBell to avoid exploding Workers. (The ably library has a `window` check in it)
  afterUpdate(async () => {
    if (
      browser &&
      $page.data.mb_config &&
      client === undefined &&
      started === false
    ) {
      started = true;

      const lib = await import('@magicbell/core');

      client = await lib.default.createInstance($page.data.mb_config);
      $Notifications.instance = new lib.NotificationStore();

      await reloadNotifications();

      dispose = client.startRealTimeListener();

      lib.pushEventAggregator.on('notifications.new', reloadNotifications);
      lib.pushEventAggregator.on('notifications.read.all', reloadNotifications);
      lib.pushEventAggregator.on('notifications.delete', reloadNotifications);
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
{#if $page.data.footer_disabled === undefined}
  <SiteFooter />
{/if}
<SiteLoader />
{#if $page.data.my_nametag}
  <MyNotifications />
{:else}
  <Onboarding />
{/if}
