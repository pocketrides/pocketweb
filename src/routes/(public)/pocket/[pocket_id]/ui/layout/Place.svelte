<script lang="ts">
  import Container from '$lib/components/Container.svelte';
  import PlaceDisplay from '$lib/components/PlaceDisplay.svelte';
  import type { ServerPocket } from '$lib/zod/Pocket';
  import type { Writable } from 'svelte/store';

  export let pocket: Writable<ServerPocket>;
</script>

{#if $pocket.details.place}
  <Container>
    <PlaceDisplay place={$pocket.details.place} icon="place" />
  </Container>
{/if}
