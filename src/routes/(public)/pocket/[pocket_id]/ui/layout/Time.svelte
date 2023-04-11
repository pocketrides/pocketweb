<script lang="ts">
  import Container from '$lib/components/Container.svelte';
  import PocketTimeRenderer from '$lib/components/pockets/PocketTimeRenderer.svelte';
  import type { ServerPocket } from '$lib/zod/Pocket';
  import type { Writable } from 'svelte/store';

  export let pocket: Writable<ServerPocket>;
</script>

<Container>
  <PocketTimeRenderer details={$pocket.details} />
</Container>
