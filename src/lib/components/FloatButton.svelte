<script lang="ts">
  import type { Fill } from '$lib/zod/Fill';
  import Icon from './Icon.svelte';

  export let icon: string;
  export let fill: Fill = 'dark';
</script>

<button on:click data-flex="cc" data-fill={fill}>
  <Icon {icon} />
</button>

<style lang="scss">
  button {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
</style>
