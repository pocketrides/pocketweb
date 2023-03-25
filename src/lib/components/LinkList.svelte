<script lang="ts">
  export let padded: boolean | 'h' | 'v' = false;
</script>

<div data-flex="scroll-h ae" data-gap data-padded={padded ? padded : undefined}>
  <slot />
</div>

<style lang="scss">
  [data-flex] {
    scroll-padding-left: 1rem;
  }
</style>
