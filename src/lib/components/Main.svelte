<script lang="ts">
  import { page } from '$app/stores';
  import DefaultUtilityNav from '$lib/utility-navs/DefaultUtilityNav.svelte';
  import type { Fill } from '$lib/zod/Fill';
  import Container from './Container.svelte';

  export let fill: Fill = 'light';
  export let padded: boolean = true;
  export let minheight: boolean = true;
</script>

<main data-fill={fill}>
  <div class:minheight>
    <Container rounded={false} {padded}>
      <slot />
    </Container>
  </div>
  <slot name="utility-nav">
    {#if $page.data.my_nametag === undefined}
      <DefaultUtilityNav />
    {/if}
  </slot>
</main>

<style lang="scss">
  .minheight {
    min-height: 100vh;
  }
</style>
