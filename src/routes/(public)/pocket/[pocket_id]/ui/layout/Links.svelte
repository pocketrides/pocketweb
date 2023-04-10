<script lang="ts">
  import type { ServerPocket } from '$lib/zod/Pocket';
  import type { Writable } from 'svelte/store';

  export let pocket: Writable<ServerPocket>;
</script>

<p>{$pocket.details.links?.length} links</p>
