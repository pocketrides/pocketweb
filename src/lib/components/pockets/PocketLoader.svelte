<script lang="ts">
  import type { ServerPocket } from '$lib/zod/Pocket';
  import { writable } from 'svelte/store';
  import PocketDisplay from '../PocketDisplay.svelte';
  import { onMount } from 'svelte';
  import { RetrievePocketRequest } from '$lib/api/pocket/retrieve';

  export let pocket_id: string;

  const pocket = writable<ServerPocket | undefined>(undefined);

  onMount(async () => {
    setTimeout(async () => {
      $pocket = await RetrievePocketRequest.get(pocket_id);
    }, 1);
  });
</script>

{#if $pocket}
  <PocketDisplay pocket={$pocket} mini />
{/if}
