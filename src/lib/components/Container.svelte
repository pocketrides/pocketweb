<script lang="ts">
  import type { Fill } from '$lib/zod/Fill';

  export let fill: Fill | 'none' = 'none';
  export let rounded: boolean = false;
  export let padded: boolean = true;
  export let bordered: boolean = false;
  export let bottombordered: boolean = false;
</script>

<div data-fill={fill} class:rounded class:padded class:bordered class:bottombordered>
  <slot />
</div>

<style lang="scss">
  div {
    width: 100%;
    max-width: 640px;
    margin: auto;
  }

  .padded {
    padding: 1rem;
  }

  :global([data-padded]) {
    padding: 1rem;
  }

  .rounded {
    border-radius: 1rem;
    overflow: hidden;
  }

  .bordered {
    border: 1px solid rgba(var(--dark), 0.5);

    :global([data-padded]:not(:last-child)) {
      border-bottom: 1px solid rgba(var(--dark), 0.25);
    }
  }

  .bottombordered {
    border-bottom: 1px solid rgba(var(--dark), 0.25);
  }
</style>
