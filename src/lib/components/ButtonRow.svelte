<script lang="ts">
  import { writable } from 'svelte/store';

  export let initial: string | undefined = undefined;
  export let vertical: boolean = false;

  const controller = writable(initial);

  $: if (initial) $controller = initial;
</script>

<div data-button-row class:vertical>
  <slot {controller} />
</div>
