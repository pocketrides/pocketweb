<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';
  import Button from './Button.svelte';
  import Container from './Container.svelte';

  export let has_more = true;
  export let no_more = false;
  export let has_none = false;
  export let load_more_label: string = 'Load more';

  export let el: HTMLDivElement | undefined = undefined;

  const dispatch = createEventDispatcher();
  const loading_more = writable(false);

  const loadMoreClick = () => {
    $loading_more = true;

    setTimeout(() => {
      $loading_more = false;
    }, 1500);

    dispatch('loadmore');
  };
</script>

<div bind:this={el}>
  <slot />
  {#if has_none}
    <div class="wrap">
      <Container padded rounded bordered fill="superlight">
        <div class="none" data-flex="v je">
          <h2 class="h1 jumbo half thin">
            <span class="material-icons-outlined">sentiment_dissatisfied</span><br />
            Nothing here… <span class="half">yet!</span>
          </h2>
        </div>
      </Container>
    </div>
  {/if}
  {#if has_more && !has_none}
    <div class="wrap" data-flex="cc" data-fill="system-light">
      <Button
        label={$loading_more ? 'One sec!' : load_more_label}
        xlarge
        disabled={$loading_more}
        on:click={loadMoreClick}
      />
    </div>
  {/if}
  {#if no_more && !has_none}
    <div class="wrap" data-flex="cc" data-fill="system-light">
      <Button label="All done!" xlarge disabled primary />
    </div>
  {/if}
</div>

<style lang="scss">
  .wrap {
    padding: 1rem;
  }

  @media (max-width: 640px) {
    .none {
      aspect-ratio: 12/16;
    }
  }

  @media (min-width: 640px) {
    .none {
      aspect-ratio: 16/9;
    }
  }

  h2 {
    display: block;
    line-height: 1;
  }
</style>
