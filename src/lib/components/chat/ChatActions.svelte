<script lang="ts">
  import { getTimeAgo } from '$lib/util/time-ago';
  import { onDestroy, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import Nametag from '../Nametag.svelte';
  import type { ClientChat } from '$lib/zod/Chat';

  export let chat: ClientChat;

  const time_ago = writable(getTimeAgo(chat.ts / 1000, 'round-minute'));
  let int_id: any;

  const updateTimeAgo = () => {
    $time_ago = getTimeAgo(chat.ts / 1000, 'round-minute');
  };

  onMount(() => {
    int_id = setInterval(updateTimeAgo, 1000);
  });

  onDestroy(() => {
    clearInterval(int_id);
  });
</script>

<div data-flex="ac" data-gap>
  <Nametag nametag={chat.nametag} tiny />
  <small class="half">{$time_ago}</small>
</div>
