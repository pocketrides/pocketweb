<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import ButtonRow from '$lib/components/ButtonRow.svelte';
  import Container from '$lib/components/Container.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import { App } from '$lib/stores/app';
  import { Notifications, reloadNotifications } from '$lib/stores/notifications';
  import { writable } from 'svelte/store';
  import NotificationItem from './MyNotifications/NotificationItem.svelte';

  const controller = writable('close');
  const marking_as_read = writable(false);

  const markAllRead = async () => {
    $marking_as_read = true;

    if ($Notifications.instance) await $Notifications.instance.markAllAsRead();

    await reloadNotifications();

    $marking_as_read = false;
    $controller = 'close';
  };
</script>

<Sheet
  id="notifications"
  header="Notifications"
  icon={$Notifications.unread_count === 0 ? 'notifications' : 'notifications_active'}
>
  <div slot="header-action">
    <ButtonRow>
      {#if $Notifications.items.length && $Notifications.items.filter((n) => !n.isRead).length}
        <Button
          {controller}
          id="mark"
          label={$marking_as_read ? 'One sec!' : 'Mark as read'}
          disabled={$marking_as_read}
          icon="done"
          on:click={markAllRead}
        />
      {/if}
      <Button
        {controller}
        id="close"
        label="Close"
        icon="close"
        on:click={() => {
          $App.sheet_id = '';
        }}
      />
    </ButtonRow>
  </div>
  {#if $Notifications.items.length}
    <ul data-unstyle data-flex="v" data-gap>
      {#each $Notifications.items as notif (notif.id)}
        <NotificationItem {notif} />
      {/each}
    </ul>
  {:else}
    <Container rounded fill="system-superlight">
      <div data-flex="v cc">
        <h2 class="half">All caught up.</h2>
      </div>
    </Container>
  {/if}
</Sheet>

<style lang="scss">
  h2 {
    margin: 3rem 0;
  }
</style>
