<script lang="ts">
  import type { Fill } from '$lib/zod/Fill';

  export let fill: Fill | 'none' = 'none';
</script>

<div data-fill={fill}>
  <slot />
</div>

<style lang="scss">
  div {
    overflow: scroll auto;
    scroll-behavior: auto;
    scroll-snap-type: x mandatory;
    width: 100vw;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;

    &::-webkit-scrollbar {
      display: none;
      opacity: 0;
    }
  }
</style>
