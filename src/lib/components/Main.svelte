<script lang="ts">
  import Container from './Container.svelte';

  export let padded: boolean = true;
  export let top_padded_lg: boolean = true;
  export let padding_override: string | undefined = undefined;
  export let fullheight: boolean = false;
  export let fullwidth: boolean = false;
</script>

<main data-fill="white">
  <div class:fullheight class:top_padded_lg>
    <Container rounded={false} {padded} {padding_override} {fullwidth}>
      <slot />
    </Container>
  </div>
  <slot name="utility-nav" />
</main>

<style lang="scss">
  .fullheight:not(:has([data-nothing-here])) {
    min-height: 100vh;
  }

  div {
    overflow: hidden;

    @media (min-width: 640px) {
      &.top_padded_lg {
        padding-top: 1rem;
      }
    }
  }
</style>
