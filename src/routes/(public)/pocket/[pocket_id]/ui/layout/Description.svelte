<script lang="ts">
  import type { ServerPocket } from '$lib/zod/Pocket';
  import type { Writable } from 'svelte/store';

  export let pocket: Writable<ServerPocket>;
</script>

<h2>{@html $pocket.details.desc_html}</h2>
