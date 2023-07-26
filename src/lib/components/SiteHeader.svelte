<script lang="ts">
  import Container from './Container.svelte';
  import Row from './Row.svelte';
  import { is_standalone } from '$lib/util/is-standalone';
  import Icon from './Icon.svelte';
  import { onMount } from 'svelte';
  import Button from './Button.svelte';
  import { App } from '$lib/stores/app';

  export let sticky: boolean = false;
  export let utility: boolean = false;
  export let huddable: boolean = false;
  export let show_back: boolean = false;
  export let padding_override: string | undefined = undefined;
  export let header_flex: string = 'sb ac';

  let hud = false;
  let safehud = false;

  /*
  const checkForScrollingUp = (delay = 150) => {
    if (interval_id) return;
    if (!huddable) return;
    if (!has_init) {
      hud = true;
      safehud = true;
      return;
    }
    const start_y = window.scrollY;
    let header_height = document.querySelector('main')?.offsetTop || 640;
    if (start_y < header_height) hud = true;
    clearInterval(interval_id);
    interval_id = setTimeout(() => {
      if (start_y > window.scrollY || window.scrollY < SCROLL_MIN) hud = true;

      hud =
        window.scrollY < header_height ||
        window.scrollY < start_y ||
        window.scrollY < SCROLL_MIN;

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
  */

  const handleScroll = () => {
    // safehud = window.scrollY > 640;
  };

  let header_outer: HTMLElement;
  let header_height = 64;

  const handleResize = () => {
    header_height = header_outer.offsetHeight;
  };

  onMount(handleResize);
</script>

<!-- <svelte:window on:scroll={handleScroll} /> -->
<svelte:window on:resize={handleResize} on:scroll={handleResize} />

{#if is_standalone}
  <div class="clipper" data-fill="dark" />
{/if}
<div data-gallery data-fill="dark">
  <slot name="gallery" />
</div>
<header
  data-fill="dark"
  class:utility
  class:sticky
  class:huddable
  class:hud
  class:safehud
  bind:this={header_outer}
>
  <Container {padding_override} padded={padding_override ? false : true}>
    <div data-flex="v" data-gap>
      {#if show_back && is_standalone}
        <Row>
          <a
            href="#back"
            class="small"
            slot="left"
            data-unstyle
            on:click|preventDefault={() => history.go(-1)}
          >
            <Icon icon="arrow_back_ios" />
            Back
          </a>
        </Row>
      {/if}
      <Row flex={header_flex}>
        <slot name="left" slot="left">&nbsp;</slot>
        <slot name="right" slot="right">
          {#if is_standalone === false}
            <Button
              label="Get the app"
              on:click={() => ($App.sheet_id = 'get_the_app')}
            />
          {/if}
          <!--<div data-flex data-button-row>
          <Button
            label=""
            icon="search"
            icon_bold
            no_underline
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
            {#if $page.url.pathname === `/profile/${$page.data.my_nametag.id}` || $page.url.pathname === `/profile/${$page.data.my_nametag.id}/pockets`}
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
      -->
        </slot>
      </Row>
    </div>
  </Container>
</header>
<div data-slot data-fill="dark">
  <slot />
</div>

<div
  data-nav
  data-fill="base"
  class:sticky
  class:huddable
  class:hud
  on:touchend={() => {
    hud = true;
  }}
  style={`--header-height: ${header_height}px`}
>
  <slot name="nav" />
</div>

<style lang="scss">
  header {
    padding-top: env(safe-area-inset-top);

    &:has(~ [data-nav]:not(:empty)) {
      border-bottom-left-radius: 1rem;
      border-bottom-right-radius: 1rem;
    }
  }

  [data-gallery]:not(:empty) + header {
    // padding-top: 0;
    margin-top: calc(-1 * env(safe-area-inset-top));
    // transform: translateY(-50px);
  }

  // header:has(~ [data-slot]:empty):has(~ [data-nav]:empty):has(
  //     ~ [data-gallery]:empty
  //   ):not([data-fill='dark']),
  // header:not([data-fill='dark']):has(~ [data-gallery]:empty):has(
  //     ~ [data-nav]:empty
  //   ):has(~ [data-slot]:empty),
  // header:has(~ [data-gallery]:not(:empty)).safehud,
  // [data-nav]:not(:empty) {
  //   border-bottom-left-radius: 1rem;
  //   border-bottom-right-radius: 1rem;

  //   box-shadow: 0 16px 16px -22px rgba(var(--dark), 0.75);
  //   border-bottom: 1px solid rgba(var(--dark), 0.5);

  //   overflow: hidden;
  // }

  @media (min-width: 640px) {
    [data-gallery]:not(:empty) {
      // border-bottom-left-radius: 1rem;
      // border-bottom-right-radius: 1rem;

      box-shadow: 0 16px 16px -22px rgba(var(--dark), 0.75);
      border-bottom: 1px solid rgba(var(--dark), 0.5);

      overflow: hidden;
    }
  }

  [data-slot]:not(:empty) {
    padding-bottom: 1rem;
    position: relative;
    z-index: 39;

    &:has(+ [data-nav]:not(:empty)) {
      border-bottom-left-radius: 1rem;
      border-bottom-right-radius: 1rem;
    }
  }

  [data-nav]:not(:empty) {
    margin-top: -1rem;
    padding-top: 1rem;
    position: sticky;
    top: calc(var(--header-height) - 1rem);
    z-index: 38;
  }

  [data-gallery]:not(:empty) {
    position: relative;
    z-index: 41;
  }

  // [data-gallery]:not(:empty) {
  //   border-bottom: 0 none;
  // }

  // header[data-fill='dark'] {
  //   border-bottom: 2px solid rgb(var(--dark));
  //   border-radius: 0;
  //   box-shadow: none;
  //   margin-bottom: -1px;
  // }

  // header.utility {
  //   border-bottom-left-radius: 0 !important;
  //   border-bottom-right-radius: 0 !important;
  //   border-bottom: 1px solid rgba(var(--dark), 0.5) !important;
  // }

  header.sticky,
  header.huddable {
    position: sticky;
    top: 0;
    z-index: 40;
  }

  // [data-nav].sticky,
  // [data-nav].huddable {
  //   position: sticky;
  //   top: calc(0 + env(safe-area-inset-top));
  //   z-index: 38;
  // }

  // .huddable {
  //   transform: translateY(calc(-92px + 1rem));

  //   &[data-fill='dark'] {
  //     transform: translateY(calc(-95px));
  //   }
  // }

  // header.huddable :global(> *) {
  //   transition: opacity 0.15s ease-in-out;
  // }

  // header.huddable:not(.hud) :global(> *) {
  //   opacity: 0;
  // }

  // [data-nav].huddable {
  //   transform: translateY(calc(-92px + 1rem));

  //   &[data-fill='dark'] {
  //     transform: translateY(calc(-95px));
  //   }
  // }

  // .huddable.hud,
  // .huddable.hud[data-fill='dark'] {
  //   transform: translateY(0px);
  // }

  // .huddable.has_init {
  //   transition: transform 0.15s ease-in-out;
  // }

  // header:has(~ [data-gallery]:not(:empty)) {
  //   position: fixed;
  //   width: 100%;
  //   z-index: 40;

  //   transition: all 0.25s ease-in-out;

  //   &:not(.safehud) {
  //     background-color: transparent;
  //     box-shadow: none;
  //     border: 0 none;
  //     z-index: 40;
  //   }
  // }

  [data-gallery] {
    max-width: 720px;
    margin: auto;
    position: relative;
    z-index: 41;
  }

  [data-gallery]:empty {
    display: none;
  }

  // [data-nav] :global(> .padded) {
  //   padding-top: 1px;
  // }

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
