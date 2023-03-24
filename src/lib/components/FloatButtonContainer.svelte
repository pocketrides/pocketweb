<script lang="ts"></script>

<div data-flex data-gap="sm" data-flow-button-container>
  <slot />
</div>

<style lang="scss">
  div {
    position: absolute;
    top: -16px;
    right: -16px;
    z-index: 1;
  }

  :global(*:has(> [data-flow-button-container])) {
    position: relative;
  }
</style>
