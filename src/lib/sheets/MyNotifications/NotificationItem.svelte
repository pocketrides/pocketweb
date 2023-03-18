<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import { App } from '$lib/stores/app';
  import { reloadNotifications } from '$lib/stores/notifications';
  import type { Notification } from '@magicbell/core';
  import { afterUpdate } from 'svelte';
  import { writable } from 'svelte/store';
  import { slide } from 'svelte/transition';

  export let notif: Notification;

  let notif_store = writable(notif);
  let selection: 'read' | 'unread' | 'delete' | '' = '';

  const is_deleting = writable(false);

  afterUpdate(() => {
    $notif_store = notif;
  });

  const handleSelection = async () => {
    switch (selection) {
      case 'read':
        $notif_store.isRead = true;
        await notif.markAsRead();
        break;
      case 'unread':
        $notif_store.isRead = false;
        await notif.markAsUnread();
        break;
      case 'delete':
        try {
          $is_deleting = true;
          await notif.delete();
        } catch (e) {}
        break;
    }

    await reloadNotifications();

    selection = '';
  };

  const actionClick = async () => {
    $App.sheet_id = '';
    await notif.markAsRead();
    await reloadNotifications();
  };
</script>

{#if $is_deleting === false}
  <li
    in:slide|local
    out:slide|local
    data-fill={$notif_store.isRead
      ? undefined
      : $notif_store.actionUrl
      ? 'system-superlight'
      : undefined}
    data-3d={$notif_store.isRead
      ? undefined
      : $notif_store.actionUrl
      ? ''
      : undefined}
    data-flex="sb"
    class:half={$notif_store.isRead}
  >
    <div
      class="wrapper"
      data-flex="v"
      data-unread={$notif_store.isRead ? undefined : ''}
    >
      {#if $notif_store.actionUrl}
        <a href={$notif_store.actionUrl} data-unstyle on:click={actionClick}>
          <h3 class="half">{$notif_store.title}</h3>
          {#if $notif_store.content}
            <p>{$notif_store.content}</p>
          {/if}
        </a>
      {:else}
        <h3 class="half">{$notif_store.title}</h3>
        {#if $notif_store.content}
          <p>{$notif_store.content}</p>
        {/if}
      {/if}
    </div>
    <div data-flex="cc">
      <select bind:value={selection} on:change={handleSelection} data-sham>
        <optgroup label="Options">
          {#if $notif_store.isRead}
            <option value="unread">Mark as unread</option>
          {:else}
            <option value="read">Mark as read</option>
          {/if}
          <option value="delete">Delete</option>
        </optgroup>
      </select>
      <Button
        icon="more_horiz"
        label=""
        transparent={$notif_store.isRead ? false : true}
      />
    </div>
  </li>
{/if}

<style lang="scss">
  li {
    height: auto;

    .wrapper {
      flex: 1;

      &[data-unread] {
        padding: 0.5rem;
      }
    }
  }
</style>
