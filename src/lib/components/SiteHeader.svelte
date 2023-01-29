<script lang="ts">
  import { App } from '$lib/stores/app';
  import { page } from '$app/stores';
  import Button from './Button.svelte';
  import Container from './Container.svelte';
  import Logo from './Logo.svelte';
  import Nametag from './Nametag.svelte';
  import Row from './Row.svelte';
  import type { Fill } from '$lib/zod/Fill';

  export let utility: boolean = false;
  export let outer_fill: Fill | 'none' = 'light';
</script>

<div data-fill={outer_fill} class:utility>
  <header data-fill={$App.fill}>
    <Container>
      <Row>
        <slot name="left" slot="left"><Logo /></slot>
        <slot name="right" slot="right">
          {#if $page.data.my_nametag}
            <Nametag nametag={$page.data.my_nametag} />
          {:else}
            <Button
              label="Join pocketrides!"
              on:click={() => ($App.sheet_id = 'onboarding')}
            />
          {/if}
        </slot>
      </Row>
    </Container>
  </header>
</div>

<style lang="scss">
  header {
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;

    border-bottom: 1px solid rgba(var(--dark), 0.5);
    box-shadow: 0 16px 16px -24px rgba(var(--dark), 0.75);

    display: flex;
    justify-content: space-between;
  }

  .utility header {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
</style>
