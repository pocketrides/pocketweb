<script lang="ts">
  import type { SheetContext } from '$lib/contexts/Sheet';
  import { App } from '$lib/stores/app';
  import { scrollToEnhanced } from '$lib/util/scroll-to';
  import { afterUpdate, createEventDispatcher, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { fly } from 'svelte/transition';
  import Button from './Button.svelte';
  import Container from './Container.svelte';
  import Icon from './Icon.svelte';
  import Row from './Row.svelte';

  export let id: string;
  export let icon: string | undefined = undefined;
  export let header: string | undefined = undefined;
  export let close: string = 'Close';
  export let dismissable: boolean = true;
  export let padded: boolean = true;
  export let nav_height: number = 0;

  let dialog: HTMLDialogElement;
  let scrolls: HTMLDivElement;
  let closing = false;
  let interval: any;

  const dispatch = createEventDispatcher();

  const context = setContext<SheetContext>(
    'sheet',
    writable({ icon, header, dismissable })
  );

  const dismiss = () => {
    if ($context.dismissable === false) return;
    $App.sheet_id = '';
  };

  const scrollTo = (y: number | null, el: any = scrolls, max: number = 10) => {
    scrollToEnhanced(() => {
      el.scrollTo(0, y ? y : el.scrollHeight);
    });
  };

  const scrollContentToBottom = () => {
    scrollTo(null);
  };

  export const scrollToBottomIfAtBottom = () => {
    if (!scrolls) return;

    if (
      Math.ceil(scrolls.scrollTop) >
      Math.floor(scrolls.scrollHeight - scrolls.clientHeight) - scrolls.scrollHeight
    )
      scrollContentToBottom();
  };

  const focus = (e: FocusEvent) => {
    const targ = e.target as HTMLElement;
    if (['textarea'].indexOf(targ.nodeName.toLowerCase()) !== -1)
      scrollContentToBottom();
  };

  const dialogClosed = () => {
    if ($context.dismissable === true) $App.sheet_id = '';
  };

  afterUpdate(() => {
    if (icon && $context.icon !== icon) $context.icon = icon;
    if (header && $context.header !== header) $context.header = header;
    if (dismissable && $context.dismissable !== dismissable)
      $context.dismissable = dismissable;

    if ($App.sheet_id === id && dialog.open === false) {
      dispatch('activate');
      dialog.showModal();
    } else if ($App.sheet_id !== id) {
      if (dialog.open) {
        closing = true;
        setTimeout(() => {
          if (dialog) dialog.close();
          closing = false;
        }, 750);
        dispatch('dismiss');
      }
    }
  });
</script>

<dialog
  bind:this={dialog}
  class:closing
  on:close={dialogClosed}
  on:cancel|preventDefault={dialogClosed}
>
  {#if $App.sheet_id === id}
    <div
      class="wrapper"
      data-fill="system-light"
      bind:this={scrolls}
      on:scroll
      on:focus|capture={focus}
      in:fly|local={{ y: '100vh', opacity: 1, duration: 300 }}
      out:fly|local={{ y: '100vh', opacity: 1, duration: 300 }}
      style={`--nav-height: ${nav_height}px`}
    >
      <header class="header" data-fill="system-superlight">
        <Container>
          <Row>
            <div slot="left">
              {#if $context.header}
                <h2>
                  <Icon icon={$context.icon} />
                  {$context.header}
                </h2>
              {/if}
            </div>
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
      <div class="content">
        <Container {padded}>
          <slot controller={context} {scrollContentToBottom} />
        </Container>
      </div>
      <div class="nav">
        <slot name="nav" controller={context} {scrollContentToBottom} />
      </div>
    </div>
  {/if}
</dialog>

<style lang="scss">
  dialog {
    margin: 0;
    padding: 0;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100dvh;
    z-index: 50;
    overflow-x: hidden;
    overflow-y: scroll;
    max-width: none;
    max-height: none;
    border: 0 none;

    background-color: transparent;

    overscroll-behavior: contain;

    &::backdrop {
      background-color: rgba(var(--allblack), 0);
      transition: background-color 0.3s ease-out;
    }

    &[open]::backdrop {
      background-color: rgba(var(--allblack), 0.75);
    }

    &[open].closing::backdrop {
      background-color: rgba(var(--allblack), 0);
    }

    .wrapper {
      position: fixed;
      width: 100%;
      height: 100%;
      bottom: 0;
      min-height: 100%;
      overflow-x: hidden;
      overflow-y: scroll;

      @media (min-width: 640px) {
        min-height: auto;
        max-height: 80vh;
        border-top-right-radius: 1rem;
        border-top-left-radius: 1rem;
        overflow-x: hidden;
      }
    }

    .header {
      position: sticky;
      top: 0;
      border-bottom: 1px solid rgba(var(--dark), 0.25);
      z-index: 1;
    }

    @media (max-width: 640px) {
      &:has(textarea:focus) {
        .header {
          position: static;
        }
      }
    }

    .nav {
      position: fixed;
      bottom: 0;
      width: 100%;
    }

    &:has(.nav:not(:empty)) .wrapper {
      padding-bottom: var(--nav-height);
    }
  }
</style>
