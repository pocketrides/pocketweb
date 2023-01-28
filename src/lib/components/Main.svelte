<script lang="ts">
  import type { Fill } from '$lib/zod/Fill';
  import Container from './Container.svelte';

  export let fill: Fill = 'light';
  export let padded: boolean = true;
</script>

<main data-fill={fill}>
  <div>
    <Container rounded={false} {padded}>
      <slot />
    </Container>
  </div>
  <slot name="utility-nav" />
</main>

<style lang="scss">
  div {
    min-height: 100vh;
  }
</style>
