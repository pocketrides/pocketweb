<script lang="ts">
  import { goto } from '$app/navigation';
  import { typewriter } from '$lib/util/transition';
  import type { ThemeAnyValue } from '$lib/zod/Theme';
  import { nanoid } from 'nanoid';
  import { afterUpdate } from 'svelte';
  import { writable, type Writable } from 'svelte/store';
  import Icon from './Icon.svelte';

  export let label: string;
  export let count: string | number | undefined = undefined;

  export let type: 'button' | 'submit' = 'button';
  export let icon: string | undefined = undefined;
  export let icon_filled: boolean = false;
  export let icon_spins: boolean = false;
  export let disabled: boolean = false;
  export let name: string = '';
  export let value: string = '';
  export let href: string | undefined = undefined;
  export let target: string | undefined = undefined;

  export let small: boolean = false;
  export let primary: boolean = false;
  export let theme: ThemeAnyValue | undefined = undefined;
  export let system: boolean = false;
  export let large: boolean = false;
  export let jumbo: boolean = false;
  export let xlarge: boolean = false;
  export let transparent: boolean = false;
  export let superdark: boolean = false;

  export let id: string = nanoid();
  export let controller: Writable<string> = writable(id);

  const label_store = writable(label);
  const icon_store = writable({
    icon,
    icon_filled,
    icon_spins
  });

  $: $icon_store.icon = icon;
  $: $icon_store.icon_filled = icon_filled;
  $: $icon_store.icon_spins = icon_spins;

  const controllerClick = (e: any) => {
    if ($controller !== id) {
      e.stopPropagation();
    }

    $controller = id;
  };

  const hrefClick = () => {
    if (href) {
      if (href.includes('/_/')) location.href = href;
      else if (target === '_blank') window.open(href);
      else goto(href, { invalidateAll: true });
    }
  };

  afterUpdate(() => {
    $label_store = label;
  });
</script>

<button
  class:h2={jumbo || xlarge}
  class:h3={!jumbo && !xlarge}
  {id}
  {type}
  {disabled}
  {name}
  {value}
  class:primary
  class:system
  class:large
  class:jumbo
  class:xlarge
  class:small
  class:transparent
  data-fill={transparent
    ? ''
    : primary
    ? 'base'
    : system
    ? 'system-base'
    : superdark
    ? 'superdark'
    : 'system-superlight'}
  data-theme={theme}
  data-3d={transparent ? undefined : ''}
  on:click|capture={controllerClick}
  on:click
  on:click={hrefClick}
>
  <Icon
    icon={$icon_store.icon}
    filled={($icon_store.icon_filled || primary) &&
      $icon_store.icon !== 'signpost' &&
      $icon_store.icon != 'airline_stops' &&
      $icon_store.icon != 'hail'}
    spins={$icon_store.icon_spins}
  />
  {#if count !== undefined && ($controller !== id || $label_store === '')}
    <span>{count}</span>
  {/if}
  {#if $controller === id}
    <span
      in:typewriter|local={{ duration: 50 }}
      out:typewriter|local={{ duration: 50 }}
    >
      {$label_store}
    </span>
  {/if}
</button>

<style lang="scss">
  button {
    padding: 0 0.5rem;
    height: 32px;
    white-space: nowrap;
    touch-action: manipulation;

    span:empty {
      display: none;
    }
  }

  button.large,
  button.primary,
  button.system,
  button.xlarge {
    padding: 0 0.85rem;
    height: 42px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  button.xlarge {
    padding: 0 2rem;
    height: 54px;
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

  button.small {
    padding: 0 0.5rem;
    height: 32px !important;
  }

  button[data-fill='superdark'] {
    color: rgb(var(--base));
  }
</style>
