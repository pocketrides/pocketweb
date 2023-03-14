<script lang="ts">
  import { fade, slide } from 'svelte/transition';
  import Row from './Row.svelte';
  import Icon from './Icon.svelte';
  import { App } from '$lib/stores/app';
  import Container from './Container.svelte';
  import { afterUpdate, onDestroy, onMount, setContext } from 'svelte';
  import { browser } from '$app/environment';
  import { writable } from 'svelte/store';
  import type { SheetContext } from '$lib/contexts/Sheet';
  import Button from './Button.svelte';

  export let id: string;
  export let icon: string | undefined = undefined;
  export let header: string | undefined = undefined;
  export let close: string = 'Close';
  export let dismissable: boolean = true;

  let el: HTMLDivElement;

  const context = setContext<SheetContext>(
    'sheet',
    writable({ icon, header, dismissable })
  );

  $: $context.dismissable = dismissable;

  const dismiss = () => {
    if ($context.dismissable === false) return;
    if ($App.sheet_id === id) $App.sheet_id = '';
  };

  const keyboardDismiss = (e: KeyboardEvent) => {
    if (e.key && e.key.toLowerCase() === 'escape') dismiss();
  };

  onMount(() => {
    if (browser) window.addEventListener('keyup', keyboardDismiss);
  });

  onDestroy(() => {
    if (browser) window.removeEventListener('keyup', keyboardDismiss);
    $App.sheet_id = '';
  });

  afterUpdate(() => {
    if (icon && $context.icon !== icon) $context.icon = icon;
    if (header && $context.header !== header) $context.header = header;
    if (dismissable && $context.dismissable !== dismissable)
      $context.dismissable = dismissable;
  });
</script>

{#if $App.sheet_id === id}
  <div
    class="cover"
    on:click={dismiss}
    on:keyup={keyboardDismiss}
    in:fade|local
    out:fade|local
  />
  <div
    class="sheet"
    bind:this={el}
    on:scroll
    data-fill="system-light"
    on:keyup={keyboardDismiss}
    in:slide|local
    out:slide|local
  >
    <header data-fill="system-superlight">
      <Container>
        <Row>
          <h2 slot="left">
            <Icon icon={$context.icon} />
            {$context.header || ''}
          </h2>
          <div slot="right">
            <slot name="header-action">
              {#if $context.dismissable === true}
                <Button label={close} on:click={dismiss} />
              {/if}
            </slot>
          </div>
        </Row>
      </Container>
    </header>
    <article>
      <Container>
        <slot controller={context} {el} />
      </Container>
    </article>
    <slot name="nav" controller={context} {el} />
  </div>
{/if}

<style lang="scss">
  .cover {
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(var(--allblack), 0.85);
    z-index: 20;
  }

  .sheet {
    position: sticky;
    width: 100vw;
    bottom: 0;
    max-height: 80vh;
    overflow-y: auto;
    border-top-right-radius: 1rem;
    border-top-left-radius: 1rem;
    z-index: 22;

    header {
      position: sticky;
      top: 0;
      z-index: 1;
      border-bottom: 1px solid rgba(var(--dark), 0.25);
    }

    article {
      min-height: 420px;
    }
  }
</style>
