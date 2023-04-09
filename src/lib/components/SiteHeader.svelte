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

  const checkForScrollingUp = () => {
    if (!huddable) return;
    const start_y = window.scrollY;
    if (start_y < 640) hud = true;
    if (interval_id) return;
    clearInterval(interval_id);
    interval_id = setTimeout(() => {
      if (start_y > window.scrollY || window.scrollY < 100) hud = true;

      if (window.scrollY > start_y) hud = false;

      if (window.scrollY < 640) hud = true;

      clearInterval(interval_id);
      interval_id = undefined;
    }, 650);
  };

  onMount(() => {
    checkForScrollingUp();

    if (huddable) {
      setTimeout(() => {
        has_init = true;
      }, 1);
    }
  });

  beforeNavigate(() => {
    if (huddable) {
      has_init = false;
      hud = true;
      setTimeout(() => {
        has_init = true;
      }, 1);
    }
  });

  afterNavigate(() => {
    if (huddable) {
      has_init = false;
      hud = true;
      setTimeout(() => {
        has_init = true;
      }, 1);
      checkForScrollingUp();
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
              <Button href="/settings" label="Settings" icon="settings_suggest" />
            {:else}
              <Nametag nametag={$page.data.my_nametag} />
            {/if}
          {:else}
            <ButtonRow>
              <Button
                label="Sign in"
                on:click={() => ($App.sheet_id = 'onboarding')}
              />
              <Button
                label="Get account"
                primary
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
<div data-slot data-fill={fill}>
  <slot />
</div>
<div data-nav data-fill={fill} class:sticky class:huddable class:hud class:has_init>
  <slot name="nav" />
</div>
<div data-bottom>
  <slot name="bottom" />
</div>

<style lang="scss">
  header:has(~ [data-slot]:empty),
  [data-nav]:not(:empty),
  [data-bottom]:not(:empty) {
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;

    border-bottom: 1px solid rgba(var(--dark), 0.5);
    box-shadow: 0 16px 16px -24px rgba(var(--dark), 0.75);

    overflow: hidden;
    position: relative;
    z-index: 1;
  }

  header.utility {
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }

  header.sticky,
  header.huddable,
  header:has(~ [data-slot]:empty).huddable {
    position: sticky;
    top: 0;
    z-index: 40;
  }

  [data-nav].sticky,
  [data-nav].huddable {
    position: sticky;
    top: 92px;
    z-index: 38;
  }

  .huddable {
    transform: translateY(-110%);
  }

  [data-nav].huddable {
    transform: translateY(calc(-110% - 85px));
  }

  .huddable.hud {
    transform: translateY(0);
  }

  .huddable.has_init {
    transition: transform 0.35s ease-in-out;
  }

  header:has(~ [data-bottom]:not(:empty)) {
    position: absolute;
    width: 100%;

    background-color: transparent;
    box-shadow: none;
    border: 0 none;
    z-index: 40;

    &.huddable.hud {
      position: fixed;
      top: 0;
    }
  }

  [data-bottom] {
    max-width: 720px;
    margin: auto;
  }
</style>
