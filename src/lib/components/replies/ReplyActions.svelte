<script lang="ts">
  import { getTimeAgo } from '$lib/util/time-ago';
  import type { ClientReply } from '$lib/zod/Reply';
  import { onDestroy, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import Nametag from '../Nametag.svelte';

  export let reply: ClientReply;

  const time_ago = writable(getTimeAgo(reply.ts / 1000, 'round-minute'));
  let int_id: any;

  const updateTimeAgo = () => {
    $time_ago = getTimeAgo(reply.ts / 1000, 'round-minute');
  };

  onMount(() => {
    int_id = setInterval(updateTimeAgo, 1000);
  });

  onDestroy(() => {
    clearInterval(int_id);
  });
</script>

<div data-flex="ac" data-gap>
  <Nametag nametag={reply.nametag} tiny />
  <small class="half">{$time_ago}</small>
</div>
