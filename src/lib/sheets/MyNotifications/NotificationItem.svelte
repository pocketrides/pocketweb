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

    await reloadNotifications();
  };

  const readClick = async (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (['button', 'select'].indexOf(target.nodeName.toLowerCase()) !== -1) return;
    if ($notif_store.isRead) return;
    $notif_store.isRead = true;
    await notif.markAsRead();
    await reloadNotifications();
  };

  const actionClick = async () => {
    $App.sheet_id = '';
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
    data-3d={$notif_store.isRead ? undefined : 'ah'}
    data-flex="sb"
    data-gap
    data-actionable={typeof $notif_store.actionUrl === 'string'}
    data-unread={$notif_store.isRead ? undefined : ''}
    class:half={$notif_store.isRead}
    on:mouseup={readClick}
  >
    <div class="wrapper" data-flex="v" data-gap="0">
      {#if $notif_store.actionUrl}
        <a href={$notif_store.actionUrl} data-unstyle on:click={actionClick}>
          <h3 class=" small">{$notif_store.title}</h3>
          {#if $notif_store.content}
            <p class="small half">
              {@html $notif_store.content}
            </p>
          {/if}
        </a>
      {:else}
        <h3 class=" small">{$notif_store.title}</h3>
        {#if $notif_store.content}
          <p class="small half">
            {@html $notif_store.content}
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
          on:change={async (e) => {
            setTimeout(() => {
              // @ts-ignore
              e.target.value = '';
            }, 100);
          }}
          data-sham
        >
          <!-- <optgroup label="Options:"> -->
          <option disabled value="">Pick:</option>
          {#if $notif_store.isRead}
            <option value="unread">Mark as unread</option>
          {:else}
            <option value="read">Mark as read</option>
          {/if}
          <option value="delete">Delete</option>
          <!-- </optgroup> -->
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
    cursor: default;

    .wrapper {
      flex: 1;
    }

    &[data-actionable='false'][data-unread] {
      border: 1px solid rgba(var(--dark), 0.5);
      border-radius: 0.25rem;
    }

    &[data-unread] {
      .wrapper {
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
