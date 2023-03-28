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
  let select: HTMLSelectElement;
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

    select.selectedIndex = 0;
    selection = '';

    await reloadNotifications();
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
      ? 'ah'
      : undefined}
    data-flex="sb"
    data-gap
    class:half={$notif_store.isRead}
  >
    <div
      class="wrapper"
      data-flex="v"
      data-gap="0"
      data-unread={$notif_store.isRead ? undefined : ''}
    >
      {#if $notif_store.actionUrl}
        <a href={$notif_store.actionUrl} data-unstyle on:click={actionClick}>
          <h3 class="half small">{$notif_store.title}</h3>
          {#if $notif_store.content}
            <p class="small" class:half={$notif_store.isRead}>
              {$notif_store.content}
            </p>
          {/if}
        </a>
      {:else}
        <h3 class="half small">{$notif_store.title}</h3>
        {#if $notif_store.content}
          <p class="small" class:half={$notif_store.isRead}>
            {$notif_store.content}
          </p>
        {/if}
      {/if}
    </div>
    <div data-flex="cc">
      <div>
        <select
          bind:this={select}
          bind:value={selection}
          on:change={handleSelection}
          data-sham
        >
          <optgroup label="Options:">
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
    </div>
  </li>
{/if}

<style lang="scss">
  li {
    .wrapper {
      &[data-unread] {
        padding: 0.5rem;
      }
    }
  }

  [data-flex='cc'] {
    flex-shrink: 0;
  }

  @media (min-width: 640px) {
    .small {
      font-size: 1em;
    }
  }
</style>
