<script lang="ts">
  import Icon from './Icon.svelte';
</script>

<button on:click data-flex="cc" data-fill="dark">
  <Icon icon="delete" />
</button>

<style lang="scss">
  button {
    position: absolute;
    top: -16px;
    right: -16px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    z-index: 1;
  }
</style>
