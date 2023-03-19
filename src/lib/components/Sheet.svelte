<script lang="ts">
  import { browser } from '$app/environment';
  import type { SheetContext } from '$lib/contexts/Sheet';
  import { App } from '$lib/stores/app';
  import {
    afterUpdate,
    createEventDispatcher,
    onDestroy,
    onMount,
    setContext
  } from 'svelte';
  import { writable } from 'svelte/store';
  import { fade, fly, slide } from 'svelte/transition';
  import Button from './Button.svelte';
  import Container from './Container.svelte';
  import Icon from './Icon.svelte';
  import Row from './Row.svelte';

  export let id: string;
  export let icon: string | undefined = undefined;
  export let header: string | undefined = undefined;
  export let close: string = 'Close';
  export let dismissable: boolean = true;

  let outer: HTMLDivElement;
  let element: HTMLDivElement;
  let scrolls: HTMLDivElement;
  let body: HTMLDivElement;
  let focused = false;
  let last_window_y = 0;

  const dispatch = createEventDispatcher();

  const context = setContext<SheetContext>(
    'sheet',
    writable({ icon, header, dismissable })
  );

  $: $context.dismissable = dismissable;

  $: if ($App.sheet_id === id) {
    dispatch('activate');
    last_window_y = window.scrollY;
  }

  const dismiss = () => {
    if ($context.dismissable === false) return;
    if ($App.sheet_id === id) {
      $App.sheet_id = '';
      scrollTo(last_window_y);
      dispatch('dismiss');
    }
  };

  const keyboardDismiss = (e: KeyboardEvent) => {
    if (e.key && e.key.toLowerCase() === 'escape') {
      dismiss();
    }
  };

  const resize = () => {
    if (window.visualViewport && element) {
      element.style.height = window.visualViewport.height + 'px';
    }
  };

  const focus = (e: any) => {
    if (
      !(
        e.target.nodeName === 'TEXTAREA' ||
        (e.target.nodeName === 'INPUT' && e.target.type !== 'button')
      )
    )
      return;
    if (window.innerWidth > 640) return;
    if (element && element.clientHeight > 360)
      element.style.transform = 'translateY(-2000px)';
    focused = true;
    scrollTo(0);
    scrollContentToBottom();
    setTimeout(() => {
      if (element) element.style.transform = '';
    });
  };

  const blur = () => {
    focused = false;
    if (element) element.style.height = '';
  };

  const scrollTo = (y: number | null, el: any = window, max: number = 20) => {
    let count = 0;
    let interval = setInterval(() => {
      if (count < max) {
        el.scrollTo(0, y ? y : el.scrollHeight);
        count++;
      } else {
        clearInterval(interval);
      }
    }, 50);
  };

  const scrollContentToBottom = () => {
    if (scrolls) {
      scrollTo(null, scrolls);
    }
  };

  onMount(() => {
    if (browser) {
      window.addEventListener('keyup', keyboardDismiss);
      visualViewport?.addEventListener('resize', resize);
      outer.addEventListener('focus', focus, true);
      outer.addEventListener('blur', blur, true);
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener('keyup', keyboardDismiss);
      visualViewport?.removeEventListener('resize', resize);

      if (element) {
        element.style.height = '';
        element.style.top = '';
      }

      if (outer) {
        outer.removeEventListener('focus', focus, true);
        outer.removeEventListener('blur', blur, true);
      }
    }
  });

  afterUpdate(() => {
    if (icon && $context.icon !== icon) $context.icon = icon;
    if (header && $context.header !== header) $context.header = header;
    if (dismissable && $context.dismissable !== dismissable)
      $context.dismissable = dismissable;
  });
</script>

<div bind:this={outer}>
  {#if $App.sheet_id === id}
    <div
      class="outer"
      class:focused
      bind:this={element}
      in:fly|local={{ y: '100vh', opacity: 1 }}
      out:fly|local={{ y: '100vh', opacity: 1 }}
    >
      <div class="inner" bind:this={scrolls} on:scroll>
        <div class="body" bind:this={body}>
          <header class="header" data-fill="system-superlight">
            <Container>
              <Row>
                <div slot="left">
                  <h2>
                    <Icon icon={$context.icon} />
                    {$context.header}
                  </h2>
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
            <Container>
              <slot controller={context} {scrollContentToBottom} />
            </Container>
          </div>
          <div class="nav">
            <slot name="nav" controller={context} {scrollContentToBottom} />
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .outer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 22;
    overflow: hidden;
    background-color: rgba(var(--allblack), 0.85);

    &.focused {
      bottom: auto;
      top: 0;

      .header {
        position: static;
      }
    }

    .inner {
      background-color: rgb(var(--system-light));
      overflow-y: auto;
      height: 100%;
      overscroll-behavior: contain;
    }

    .header {
      position: sticky;
      top: 0;
      width: 100%;
      z-index: 1;
      border-bottom: 1px solid rgba(var(--dark), 0.25);
    }

    .nav {
      position: sticky;
      bottom: 0;
    }
  }

  @media (min-width: 640px) {
    .outer {
      .inner {
        max-height: 80vh;
        position: fixed;
        bottom: 0;
        width: 100%;

        .body:has(.nav:not(:empty)) {
          .content {
            min-height: 80vh;
          }
        }
      }
    }
  }
</style>
