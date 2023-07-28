<script lang="ts">
  export let position: 'outer_top_right' | 'inner_right' | 'inner_center_bottom' =
    'outer_top_right';
</script>

<div data-flex data-gap="sm" data-flow-button-container data-position={position}>
  <slot />
</div>

<style lang="scss">
  [data-position='outer_top_right'] {
    position: absolute;
    top: -16px;
    right: -16px;
    z-index: 1;
  }

  [data-position='inner_right'] {
    position: absolute;
    right: 16px;
    bottom: 16px;
    z-index: 1;

    @media (max-width: 640px) {
      right: 64px;
    }
  }

  [data-position='inner_center_bottom'] {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
  }

  :global(*:has(> [data-flow-button-container])) {
    position: relative;
  }
</style>
