<script lang="ts">
  import { page } from '$app/stores';
  import DefaultUtilityNav from '$lib/utility-navs/DefaultUtilityNav.svelte';
  import type { Fill } from '$lib/zod/Fill';
  import Container from './Container.svelte';

  export let fill: Fill = 'light';
  export let padded: boolean = true;
</script>

<main data-fill={fill}>
  <div class="c">
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
  .c {
    min-height: 60vh;
  }
</style>
