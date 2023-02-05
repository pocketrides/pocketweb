<script lang="ts">
  import { writable } from 'svelte/store';

  export let initial: string | undefined = undefined;

  const controller = writable(initial);
</script>

<div data-button-row>
  <slot {controller} />
</div>
