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

  export let sticky: boolean = false;
  export let utility: boolean = false;
  export let outer_fill: Fill | 'none' = 'light';
  export let fill: Fill = $App.fill;
  export let huddable: boolean = false;

  let interval_id: any;
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

  onMount(checkForScrollingUp);
</script>

<svelte:window on:scroll={checkForScrollingUp} />

<div
  class="wrapper"
  data-site-header
  data-fill={outer_fill}
  class:utility
  class:sticky
  class:huddable
  class:hud
>
  <header data-fill={fill}>
    <div class="header-inner">
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
                  />
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
        <slot />
      </Container>
    </div>
    <slot name="bottom" />
  </header>
</div>

<style lang="scss">
  .wrapper {
    position: relative;
    top: 0;
    z-index: 16;

    &.huddable,
    &.sticky,
    &.utility {
      position: sticky;
    }

    &.huddable {
      transition: transform 0.25s ease-in-out;
      transform: translateY(-120%);
    }

    &.hud {
      transform: translateY(0%);
    }
  }

  @media (min-width: 640px) {
    .wrapper[data-fill] {
      background-color: transparent;
    }
  }

  header {
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;

    border-bottom: 1px solid rgba(var(--dark), 0.5);
    box-shadow: 0 16px 16px -24px rgba(var(--dark), 0.75);

    &:has([slot='bottom']:not(:empty)) {
      position: relative;

      border-bottom-color: rgba(var(--dark), 0.85);
      box-shadow: 0 16px 16px -18px rgba(var(--dark), 0.75);

      .header-inner {
        position: absolute;
        z-index: 1;
        width: 100%;
      }
    }
  }

  .utility header {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  @media (min-width: 640px) {
    .wrapper:not(.utility) {
      display: flex;
      justify-content: center;
      max-width: 100vw;

      header {
        min-width: 672px;
      }
    }
  }
</style>
