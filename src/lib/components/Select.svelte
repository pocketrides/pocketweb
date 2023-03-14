<script lang="ts">
  import { typewriter } from '$lib/util/transition';
  import { nanoid } from 'nanoid';
  import { onMount, tick } from 'svelte';
  import { writable } from 'svelte/store';
  import Icon from './Icon.svelte';

  export let id = nanoid();
  export let value: string;
  export let autocomplete: string | undefined = undefined;
  export let collapse = false;
  export let small = false;
  export let controller = writable(id);

  let select: HTMLSelectElement;
  const selection = writable<string | undefined>();

  const update = async () => {
    if (select)
      $selection = select.querySelector(
        `option:nth-child(${select.selectedIndex + 1})`
      )?.innerHTML;
    else $selection = undefined;
  };

  onMount(update);
</script>

<div data-3d-container class:collapse>
  {#if $controller === id}
    <select
      {id}
      {autocomplete}
      data-sham
      bind:value
      bind:this={select}
      on:change={update}
      on:change
    >
      <slot />
    </select>
  {/if}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    data-3d
    class:small
    class:filled={!!value}
    class="h3"
    data-flex="sb"
    on:click={() => {
      if ($controller !== id) $controller = id;
      update();
    }}
  >
    {#if $controller === id}
      <div>
        {$selection ? $selection : 'Pick!'}
      </div>
    {/if}
    <Icon icon="unfold_more" />
  </div>
</div>

<style lang="scss">
  :not(.collapse) [data-3d] div {
    min-width: 4rem;
  }

  [data-3d] {
    user-select: none;
  }
</style>
