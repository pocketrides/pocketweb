<script lang="ts">
  import { nanoid } from 'nanoid';
  import { afterUpdate, onMount } from 'svelte';
  import Icon from './Icon.svelte';

  export let id = nanoid();
  export let value: string;
  export let autocomplete: string | undefined = undefined;
  export let collapse = false;

  let select: HTMLSelectElement;
  let selection: string | undefined;

  const update = () => {
    selection = select.querySelector(
      `option:nth-child(${select.selectedIndex + 1})`
    )?.innerHTML;
  };

  onMount(update);
</script>

<div data-3d-container class:collapse>
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
  <div data-3d class:filled={!!value} class="h3" data-flex="sb">
    <div>{selection ? selection : 'Pick!'}</div>
    <Icon icon="unfold_more" />
  </div>
</div>

<style lang="scss">
  :not(.collapse) [data-3d] div {
    min-width: 4rem;
  }
</style>
