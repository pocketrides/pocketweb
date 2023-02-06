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

  export let utility: boolean = false;
  export let outer_fill: Fill | 'none' = 'light';
  export let fill: Fill = $App.fill;
</script>

<div data-fill={outer_fill} class:utility>
  <header data-fill={fill}>
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
              />
              {#if $page.url.pathname === `/profile/${$page.data.my_nametag.id}`}
                <Button href="/account" label="Settings" icon="settings_suggest" />
              {:else}
                <Nametag nametag={$page.data.my_nametag} />
              {/if}
            {:else}
              <Button
                label="Sign in"
                on:click={() => ($App.sheet_id = 'onboarding')}
              />
            {/if}
          </div>
        </slot>
      </Row>
      <slot />
    </Container>
  </header>
</div>

<style lang="scss">
  header {
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;

    border-bottom: 1px solid rgba(var(--dark), 0.5);
    box-shadow: 0 16px 16px -24px rgba(var(--dark), 0.75);

    display: flex;
    justify-content: space-between;
  }

  .utility header {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
</style>
