<script lang="ts">
  export let padded: boolean | 'h' | 'v' = false;
</script>

<div data-flex="scroll-h ae" data-gap data-padded={padded ? padded : undefined}>
  <slot />
</div>

<style lang="scss">
  [data-flex] {
    scroll-snap-type: x mandatory;
    scroll-padding-left: 1rem;

    :global([data-3d]) {
      scroll-snap-align: start;
    }
  }
</style>
