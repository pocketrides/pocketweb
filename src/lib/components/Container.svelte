<script lang="ts">
  import type { Fill } from '$lib/zod/Fill';

  export let fill: Fill | 'none' = 'none';
  export let rounded: boolean = false;
  export let padded: boolean = true;
</script>

<div data-fill={fill} class:rounded class:padded>
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

  .rounded {
    border-radius: 1rem;
  }
</style>
