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
  import { is_standalone } from '$lib/util/is-standalone';

  export let sticky: boolean = false;
  export let utility: boolean = false;
  export let fill: Fill | 'none' = $App.fill;
  export let huddable: boolean = false;

  let interval_id: any;
  let has_init = false;
  let hud = false;
  let safehud = false;

  const SCROLL_MIN = 110;

  const checkForScrollingUp = (delay = 150) => {
    if (!huddable) return;
    if (!has_init) {
      hud = true;
      safehud = true;
      return;
    }
    const start_y = window.scrollY;
    let header_height = document.querySelector('main')?.offsetTop || 640;
    if (start_y < header_height) hud = true;
    if (interval_id) return;
    clearInterval(interval_id);
    interval_id = setTimeout(() => {
      if (start_y > window.scrollY || window.scrollY < SCROLL_MIN) hud = true;

      hud = window.scrollY < header_height || window.scrollY < start_y;
      safehud = window.scrollY > SCROLL_MIN;

      clearInterval(interval_id);
      interval_id = undefined;
    }, delay);
  };

  onMount(() => {
    if (huddable) {
      hud = true;
      setTimeout(() => {
        has_init = true;
      }, 1500);
    }
  });

  beforeNavigate(() => {
    if (huddable) {
      has_init = false;
      hud = true;
    }
  });

  afterNavigate(() => {
    if (huddable) {
      has_init = false;
      hud = true;
      setTimeout(() => {
        has_init = true;
        checkForScrollingUp(10);
      }, 10);
    }
  });

  const handleScroll = () => {
    checkForScrollingUp();
  };
</script>

<svelte:window on:scroll={handleScroll} />

{#if is_standalone}
  <div class="clipper" data-fill={fill} />
{/if}
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
      <slot name="left" slot="left">
        <Logo />
      </slot>
      <slot name="right" slot="right">
        <div data-flex data-button-row>
          <Button
            label=""
            icon="search"
            icon_bold
            transparent
            on:click={() => {
              $App.sheet_id = 'search';
            }}
          />
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

  header:has(~ [data-slot]:empty):has(~ [data-nav]:empty):has(
      ~ [data-gallery]:empty
    ):not([data-fill='dark']),
  header:not([data-fill='dark']):has(~ [data-gallery]:empty):has(
      ~ [data-nav]:empty
    ):has(~ [data-slot]:empty),
  header:has(~ [data-gallery]:not(:empty)).safehud,
  [data-nav]:not(:empty) {
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;

    box-shadow: 0 16px 16px -22px rgba(var(--dark), 0.75);
    border-bottom: 1px solid rgba(var(--dark), 0.5);

    overflow: hidden;
  }

  @media (min-width: 640px) {
    [data-gallery]:not(:empty) {
      border-bottom-left-radius: 1rem;
      border-bottom-right-radius: 1rem;

      box-shadow: 0 16px 16px -22px rgba(var(--dark), 0.75);
      border-bottom: 1px solid rgba(var(--dark), 0.5);

      overflow: hidden;
    }
  }

  [data-nav]:not(:empty),
  [data-gallery]:not(:empty) {
    position: relative;
    z-index: 1;
  }

  [data-gallery]:not(:empty) {
    border-bottom: 0 none;
  }

  header[data-fill='dark'] {
    border-bottom: 2px solid rgb(var(--dark));
    border-radius: 0;
    box-shadow: none;
    margin-bottom: -1px;
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
    transform: translateY(calc(-92px + 1rem));

    &[data-fill='dark'] {
      transform: translateY(calc(-95px));
    }
  }

  header.huddable :global(> *) {
    transition: opacity 0.15s ease-in-out;
  }

  header.huddable:not(.hud) :global(> *) {
    opacity: 0;
  }

  [data-nav].huddable {
    transform: translateY(calc(-92px + 1rem));

    &[data-fill='dark'] {
      transform: translateY(calc(-95px));
    }
  }

  .huddable.hud,
  .huddable.hud[data-fill='dark'] {
    transform: translateY(0px);
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

  [data-gallery]:empty {
    display: none;
  }

  [data-nav] :global(> .padded) {
    padding-top: 1px;
  }

  .clipper {
    position: fixed;
    top: 0;
    width: 100%;
    height: env(safe-area-inset-top);
    z-index: 35;

    &:has(~ [data-gallery]:not(:empty)) {
      &:has(~ header:not(.safehud)) {
        opacity: 0;
      }
    }
  }
</style>
