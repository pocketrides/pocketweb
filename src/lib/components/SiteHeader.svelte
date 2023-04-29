<script lang="ts">
  import { App } from '$lib/stores/app';
  import { page } from '$app/stores';
  import Button from './Button.svelte';
  import Container from './Container.svelte';
  import Logo from './Logo.svelte';
  import Nametag from './Nametag.svelte';
  import Row from './Row.svelte';
  import type { Fill } from '$lib/zod/Fill';
  import { Notifications } from '$lib/stores/notifications';
  import { onMount } from 'svelte';
  import ButtonRow from './ButtonRow.svelte';
  import { afterNavigate, beforeNavigate } from '$app/navigation';

  export let sticky: boolean = false;
  export let utility: boolean = false;
  export let fill: Fill | 'none' = $App.fill;
  export let huddable: boolean = false;

  let interval_id: any;
  let has_init = false;
  let hud = false;
  let safehud = false;

  const checkForScrollingUp = () => {
    if (!huddable) return;
    if (!has_init) return;
    const start_y = window.scrollY;
    let header_height = document.querySelector('main')?.offsetTop || 640;
    if (start_y < header_height) hud = true;
    if (interval_id) return;
    clearInterval(interval_id);
    interval_id = setTimeout(() => {
      if (start_y > window.scrollY || window.scrollY < 100) hud = true;

      hud = window.scrollY < header_height || window.scrollY < start_y;
      safehud = window.scrollY > 110;

      clearInterval(interval_id);
      interval_id = undefined;
    }, 650);
  };

  onMount(() => {
    if (huddable) {
      setTimeout(() => {
        has_init = true;
      }, 500);
    }
  });

  beforeNavigate(() => {
    if (huddable) {
      has_init = false;
      hud = true;
      setTimeout(() => {
        has_init = true;
      }, 500);
    }
  });

  afterNavigate(() => {
    if (huddable) {
      has_init = false;
      hud = true;
      setTimeout(() => {
        has_init = true;
      }, 500);
    }
  });
</script>

<svelte:window on:scroll={checkForScrollingUp} />

<header
  data-fill={fill}
  class:utility
  class:sticky
  class:huddable
  class:hud
  class:has_init
  class:safehud
>
  <Container>
    <Row>
      <slot name="left" slot="left"><Logo /></slot>
      <slot name="right" slot="right">
        <div data-flex data-button-row>
          {#if $page.data.my_nametag}
            <Button
              icon={$Notifications.unread_count === 0
                ? 'notifications'
                : 'notifications_active'}
              label=""
              count={$Notifications.unread_count}
              on:click={() => {
                $App.sheet_id = 'notifications';
              }}
            />
            {#if $page.url.pathname === `/profile/${$page.data.my_nametag.id}`}
              <Button
                href="/settings"
                label="Settings"
                icon="settings_suggest"
                primary
                small
              />
            {:else}
              <Nametag nametag={$page.data.my_nametag} />
            {/if}
          {:else}
            <ButtonRow>
              <Button
                label="Sign up"
                primary
                small
                icon="hail"
                on:click={() => ($App.sheet_id = 'onboarding')}
              />
              <Button
                label="Sign in"
                small
                on:click={() => ($App.sheet_id = 'onboarding')}
              />
            </ButtonRow>
          {/if}
        </div>
      </slot>
    </Row>
  </Container>
</header>
<div data-gallery data-fill={fill}>
  <slot name="gallery" />
</div>
<div data-slot data-fill={fill}>
  <slot />
</div>
<div data-nav data-fill={fill} class:sticky class:huddable class:hud class:has_init>
  <slot name="nav" />
</div>

<style lang="scss">
  header {
    padding-top: env(safe-area-inset-top);
  }

  header
    :has(~ [data-slot]:empty)
    :has(~ [data-nav]:empty)
    :not([data-fill='dark']):has(~ [data-gallery]:empty),
  header:has(~ [data-gallery]:not(:empty)).safehud,
  [data-nav]:not(:empty),
  [data-gallery]:not(:empty) {
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;

    border-bottom: 1px solid rgba(var(--dark), 0.5);
    box-shadow: 0 16px 16px -24px rgba(var(--dark), 0.75);

    overflow: hidden;
  }

  [data-nav]:not(:empty),
  [data-gallery]:not(:empty) {
    position: relative;
    z-index: 1;
  }

  header[data-fill='dark'],
  header:has(~ [data-slot]:empty)[data-fill='dark'] {
    border-bottom: 0 none;
    border-radius: 0;
    box-shadow: none;
  }

  header.utility {
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    border-bottom: 1px solid rgba(var(--dark), 0.5) !important;
  }

  header.sticky,
  header.huddable {
    position: sticky;
    top: 0;
    z-index: 40;
  }

  [data-nav].sticky,
  [data-nav].huddable {
    position: sticky;
    top: calc(92px + env(safe-area-inset-top));
    z-index: 38;
  }

  .huddable {
    transform: translateY(-110%);
  }

  [data-nav].huddable {
    transform: translateY(calc(-110% - 92px - env(safe-area-inset-top)));
  }

  .huddable.hud {
    transform: translateY(0);
  }

  .huddable.has_init {
    transition: transform 0.15s ease-in-out;
  }

  header:has(~ [data-gallery]:not(:empty)) {
    position: fixed;
    width: 100%;
    z-index: 40;

    transition: all 0.25s ease-in-out;

    &:not(.safehud) {
      background-color: transparent;
      box-shadow: none;
      border: 0 none;
      z-index: 40;
    }
  }

  [data-gallery] {
    max-width: 720px;
    margin: auto;
  }

  [data-nav] :global(> .padded) {
    padding-top: 1px;
  }
</style>
