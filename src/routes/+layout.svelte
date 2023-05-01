<script lang="ts">
  import '$lib/styles/global.scss';
  import '@material-symbols/font-500/rounded.scss';
  import '@fontsource/dm-sans/400.css';
  import '@fontsource/dm-sans/400-italic.css';
  import '@fontsource/dm-sans/500.css';
  import '@fontsource/dm-sans/500-italic.css';
  import '@fontsource/dm-sans/700.css';
  import '@fontsource/dm-sans/700-italic.css';

  import { browser } from '$app/environment';
  import { afterNavigate, beforeNavigate } from '$app/navigation';
  import { page } from '$app/stores';
  import SiteFooter from '$lib/components/SiteFooter.svelte';
  import SiteLoader from '$lib/components/SiteLoader.svelte';
  import Onboarding from '$lib/sheets/Onboarding.svelte';
  import { App } from '$lib/stores/app';
  import { afterUpdate, onDestroy, onMount } from 'svelte';
  import { Notifications, reloadNotifications } from '$lib/stores/notifications';
  import MyNotifications from '$lib/sheets/MyNotifications.svelte';
  import type MagicBellClient from '@magicbell/core';
  import Subscribe from '$lib/sheets/Subscribe.svelte';
  import PostReplies from '$lib/sheets/PostReplies.svelte';
  import { Room } from '$lib/api/room';
  import type { LayoutData } from './$types';
  import Photos from '$lib/sheets/Photos.svelte';
  import { HomepageHelper } from '$lib/util/homepage';
  import OutOfLikes from '$lib/sheets/OutOfLikes.svelte';
  import * as Fathom from 'fathom-client';
  import AppHelp from '$lib/sheets/AppHelp.svelte';

  let started: boolean = false;
  let client: MagicBellClient;
  let dispose: Function | undefined;

  export let data: LayoutData;

  HomepageHelper.magic_post_id = data.magic_post_id;

  Room.host = data.room_host;

  if ($page.data.page_theme) $App.theme = $page.data.page_theme;

  $: if (browser) {
    document.documentElement.setAttribute(
      'data-theme',
      $App.theme || $page.data.page_theme
    );
    document.documentElement.setAttribute(
      'data-fill',
      $App.fill || $page.data.page_fill
    );
    document.documentElement.setAttribute(
      'data-locked',
      $App.sheet_id === '' ? 'false' : 'true'
    );
    document.documentElement.setAttribute(
      'data-standalone',
      // @ts-ignore
      navigator.standalone || false
    );
  }

  onMount(() => {
    Fathom.load('ZAOKOHGG', {
      url: 'https://teacher-paul.pocketrides.com/script.js',
      includedDomains: ['pocketrides.com', 'pocketweb.pocketrides.workers.dev']
    });
  });

  $: $page.url.pathname, browser && Fathom.trackPageview();

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

  afterNavigate(async () => {
    $App.loading = false;
    $App.sheet_id = '';

    if ($page.data.session_expires) {
      const expiration = new Date($page.data.session_expires);

      if (expiration < new Date()) {
        location.reload();
      }
    }
  });
</script>

<svelte:head>
  <link
    rel="icon"
    href={`/pocketrides-${$App.theme || $page.data.page_theme || 'system'}.png`}
    type="image/png"
  />
  <link
    rel="apple-touch-icon"
    sizes="any"
    href={`/pocketrides-${$App.theme || $page.data.page_theme || 'system'}.png`}
  />
  <link
    rel="manifest"
    href={`/manifest.webmanifest?theme=${
      $App.theme || $page.data.page_theme || 'system'
    }`}
  />
</svelte:head>

<slot />
{#if $page.data.footer_disabled === undefined}
  <SiteFooter />
{/if}
<SiteLoader />
{#if $page.data.my_nametag}
  <MyNotifications />
  <Subscribe />
  <OutOfLikes />
{:else}
  <Onboarding />
{/if}

<PostReplies />
<Photos />
<AppHelp />
