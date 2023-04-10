<script lang="ts">
  import type { Fill } from '$lib/zod/Fill';
  import Container from './Container.svelte';

  export let fill: Fill = 'light';
  export let padded: boolean = true;
  export let fullheight: boolean = false;
  export let fullwidth: boolean = false;
</script>

<main data-fill={fill}>
  <div class:fullheight>
    <Container rounded={false} {padded} {fullwidth}>
      <slot />
    </Container>
  </div>
  <slot name="utility-nav" />
</main>

<style lang="scss">
  .fullheight:not(:has([data-nothing-here])) {
    min-height: 100vh;
  }
</style>
