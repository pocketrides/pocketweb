<script lang="ts">
  import type { Fill } from '$lib/zod/Fill';
  import Container from './Container.svelte';
  import Row from './Row.svelte';

  export let fill: Fill = 'dark';
  export let absolutebottom: boolean = false;
</script>

<div data-util-nav class:absolutebottom>
  <nav data-fill={fill}>
    <Container padded={false}>
      <Row padded>
        <slot name="left" slot="left" />
        <slot name="right" slot="right" />
      </Row>
    </Container>
  </nav>
</div>

<style lang="scss">
  div {
    position: sticky;
    bottom: calc(78px + env(safe-area-inset-bottom));
    z-index: 39;

    &.absolutebottom nav {
      padding-bottom: env(safe-area-inset-bottom);
    }
  }

  @media (max-width: 640px) {
    :global(main:has(textarea:focus)) div {
      position: static;
    }
  }

  nav {
    border-top: 1px solid rgba(var(--dark), 0.25);
    // box-shadow: 0 -16px 16px -24px rgba(var(--dark), 0.75);

    // &.border_bottom {
    //   border-bottom-right-radius: 1rem;
    //   border-bottom-left-radius: 1rem;
    //   border-bottom: 1px solid rgba(var(--dark), 0.5);
    // }
  }

  // :global([data-standalone='true']) nav {
  //   padding-bottom: calc(env(safe-area-inset-bottom) + 1rem);
  // }
</style>
