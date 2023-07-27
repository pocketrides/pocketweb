<script lang="ts">
  import type { ServerPocket } from '$lib/zod/Pocket';
  import { writable } from 'svelte/store';
  import PocketDisplay from '../PocketDisplay.svelte';
  import { onMount } from 'svelte';
  import { RetrievePocketRequest } from '$lib/api/pocket/retrieve';
  import { THEME_NAMES, THEME_VALUES } from '$lib/zod/Theme';

  export let pocket_id: string;

  const pocket = writable<ServerPocket | undefined>(undefined);

  onMount(async () => {
    setTimeout(async () => {
      $pocket = await RetrievePocketRequest.get(pocket_id);
    }, 150);
  });
</script>

{#if $pocket}
  <PocketDisplay pocket={$pocket} mini />
{:else}
  <div
    data-loading
    data-theme={THEME_VALUES[Math.round(Math.random() * THEME_VALUES.length)]}
    data-flex="v je"
  >
    <div />
    <p>&nbsp;</p>
    <p>&nbsp;</p>
  </div>
{/if}

<style lang="scss">
  div {
    flex-shrink: 0;
    width: calc(50vw - 1.25rem);
    min-width: 172px;
    max-width: 220px;
    aspect-ratio: 1/1;
    border-color: rgba(var(--base), 0.2);
    border-radius: 1rem;
    overflow: hidden;

    @media (min-width: 640px) {
      max-width: 296px;
      min-width: 296px;
    }

    p {
      width: calc(100% - 2rem);
    }
  }
</style>
