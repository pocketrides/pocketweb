<script lang="ts">
  import type { Fill } from '$lib/zod/Fill';
  import Container from './Container.svelte';
  import Row from './Row.svelte';

  export let fill: Fill = 'system-superlight';
  export let outer_fill: Fill = 'dark';
  export let border_bottom: boolean = true;
</script>

<div data-util-nav data-fill={outer_fill}>
  <nav data-fill={fill} class:border_bottom>
    <Container>
      <Row>
        <slot name="left" slot="left">&nbsp;</slot>
        <slot name="right" slot="right">&nbsp;</slot>
      </Row>
    </Container>
  </nav>
</div>

<style lang="scss">
  div {
    position: sticky;
    bottom: -1rem;
    z-index: 15;
  }

  nav {
    padding-bottom: 1rem;
    border-top: 1px solid rgba(var(--dark), 0.25);
    box-shadow: 0 -16px 16px -24px rgba(var(--dark), 0.75);

    &.border_bottom {
      border-bottom-right-radius: 1rem;
      border-bottom-left-radius: 1rem;
      border-bottom: 1px solid rgba(var(--dark), 0.5);
    }
  }
</style>
