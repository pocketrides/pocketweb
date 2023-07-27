<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import { Notifications, reloadNotifications } from '$lib/stores/notifications';
  import { writable } from 'svelte/store';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import Main from '$lib/components/Main.svelte';
  import NotificationItem from '$lib/sheets/MyNotifications/NotificationItem.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import type { PageData } from './$types';
  import { App } from '$lib/stores/app';

  export let data: PageData;

  $: $App.theme = data.my_nametag.theme;

  const marking_as_read = writable(false);

  const markAllRead = async () => {
    $marking_as_read = true;

    if ($Notifications.instance) await $Notifications.instance.markAllAsRead();

    await reloadNotifications();

    $marking_as_read = false;
  };
</script>

<SiteHeader huddable>
  <h1 slot="left">
    <Icon icon="campaign" />
    Inbox
  </h1>
  <div slot="right">
    {#if $Notifications.items.length && $Notifications.items.filter((n) => !n.isRead).length}
      <Button
        id="mark"
        label={$marking_as_read ? 'One sec!' : 'Mark as read'}
        disabled={$marking_as_read}
        icon="done"
        on:click={markAllRead}
      />
    {/if}
  </div>
</SiteHeader>
<Main>
  {#if $Notifications.items.length}
    <ul data-unstyle data-flex="v" data-gap>
      {#each $Notifications.items as notif (notif.id)}
        <NotificationItem {notif} />
      {/each}
    </ul>
  {:else}
    <Container rounded fill="system-superlight" bordered>
      <div data-flex="v cc">
        <h2 class="half">All caught up! <span class="half">For now…</span></h2>
      </div>
    </Container>
  {/if}
</Main>
