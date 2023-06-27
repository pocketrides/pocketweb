<script lang="ts">
  import { typewriter } from '$lib/util/transition';
  import type { Fill } from '$lib/zod/Fill';
  import { createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';
  import Icon from './Icon.svelte';

  export let icon: string;
  export let fill: Fill = 'dark';

  const dispatch = createEventDispatcher();
  const expanded = writable(false);

  const clickCheck = (e: Event) => {
    if (!$expanded) {
      e.stopPropagation();
      e.preventDefault();

      $expanded = true;
      return;
    }

    dispatch('click', e);
  };
</script>

<button
  on:click={clickCheck}
  data-flex={$expanded ? '' : 'cc'}
  data-gap
  data-fill={fill}
  class:expanded={$expanded}
  class="h3"
>
  <Icon {icon} />
  {#if $expanded}
    <span in:typewriter={{ duration: 50 }}>Delete</span>
  {/if}
</button>

<style lang="scss">
  button {
    width: 32px;
    height: 32px;
    border-radius: 50%;

    &.expanded {
      width: auto;
      border-radius: 1rem;
      padding: 0 0.5rem;
    }
  }
</style>
