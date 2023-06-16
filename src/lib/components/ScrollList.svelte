<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';
  import Button from './Button.svelte';
  import Container from './Container.svelte';
  import Icon from './Icon.svelte';
  import NothingHere from './NothingHere.svelte';

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

<div class="list" bind:this={el}>
  <slot />
  {#if has_none}
    <div class="wrap">
      <NothingHere />
    </div>
  {/if}
  {#if has_more && !has_none}
    <div class="wrap" data-flex="cc" data-fill="white">
      <Button
        label={$loading_more ? 'One sec!' : load_more_label}
        xlarge
        disabled={$loading_more}
        on:click={loadMoreClick}
      />
    </div>
  {/if}
  {#if no_more && !has_none}
    <div class="wrap" data-flex="cc" data-fill="white">
      <Button label="All done!" xlarge disabled primary />
    </div>
  {/if}
</div>

<style lang="scss">
  // @media (min-width: 640px) {
  //   .list {
  //     border-left: 1px solid rgba(var(--dark), 0.05);
  //     border-right: 1px solid rgba(var(--dark), 0.05);
  //   }
  // }

  .wrap {
    padding: 1rem;
  }

  // @media (min-width: 640px) {
  // .list {
  // padding-top: 1rem;
  // }
  // }
</style>
