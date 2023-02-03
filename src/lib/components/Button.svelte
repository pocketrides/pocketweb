<script lang="ts">
  import { goto } from '$app/navigation';
  import { typewriter } from '$lib/util/transition';
  import { nanoid } from 'nanoid';
  import { writable, type Writable } from 'svelte/store';
  import Icon from './Icon.svelte';

  export let label: string;
  export let count: string | number | undefined = undefined;

  export let type: 'button' | 'submit' = 'button';
  export let icon: string | undefined = undefined;
  export let disabled: boolean = false;
  export let name: string = '';
  export let value: string = '';
  export let href: string | undefined = undefined;

  export let primary: boolean = false;
  export let system: boolean = false;
  export let jumbo: boolean = false;

  export let id: string = nanoid();
  export let controller: Writable<string> = writable(id);

  const controllerClick = (e: MouseEvent) => {
    if ($controller !== id) e.stopPropagation();

    $controller = id;
  };

  const hrefClick = async () => {
    if (href) await goto(href);
  };
</script>

<button
  class:h2={jumbo}
  class:h3={!jumbo}
  {id}
  {type}
  {disabled}
  {name}
  {value}
  class:primary
  class:system
  class:jumbo
  data-fill={primary ? 'base' : system ? 'system-base' : 'system-superlight'}
  data-3d
  on:click|capture={controllerClick}
  on:click
  on:click={hrefClick}
>
  <Icon {icon} />
  {#if count}<span>{count}</span>{/if}
  {#if $controller === id}
    <span in:typewriter|local out:typewriter|local>
      {label}
    </span>
  {/if}
</button>

<style lang="scss">
  button {
    padding: 0 0.5rem;
    height: 32px;
  }

  button[disabled] {
    opacity: 0.5;
  }

  button.primary,
  button.system {
    padding: 0 0.85rem;
    height: 42px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  button.jumbo {
    padding: 1rem;
    height: 64px;
    display: inline-flex;
    justify-content: left;
    align-items: center;

    @media (min-width: 640px) {
      width: calc(50% - 0.5rem);
    }
  }
</style>
