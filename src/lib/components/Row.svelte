<script lang="ts">
  import type { Fill } from '$lib/zod/Fill';

  export let sticky: boolean = false;
  export let fill: Fill | 'none' = 'none';
  export let padded: boolean = false;
  export let bordered: boolean = false;
</script>

<div
  data-flex="sb ac"
  class:sticky
  class:padded
  class:bordered
  data-fill={fill}
  data-gap
>
  <slot name="left">&nbsp;</slot>
  <slot name="right">&nbsp;</slot>
</div>

<style lang="scss">
  .sticky {
    position: sticky;
    z-index: 15;
    top: 0;
  }

  :global([data-standalone='true']) .sticky {
    position: relative;
  }

  .padded {
    padding: 0.5rem 1rem;
  }

  .bordered {
    border-bottom: 1px solid rgba(var(--dark), 0.25);
  }

  div > :global([slot='left']:has([data-3d])) {
    padding-bottom: 1px;
    padding-left: 1px;
  }
</style>
