<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { slide } from 'svelte/transition';
  import Icon from './Icon.svelte';
  import { App } from '$lib/stores/app';
  import { Notifications } from '$lib/stores/notifications';
</script>

<div data-fill="dark" in:slide={{ axis: 'y' }}>
  <nav data-flex="cc">
    <button
      name="Home"
      data-flex="v cc"
      class:active={$page.route.id === '/' || $page.route.id === '/(private)/home'}
      on:click={() => goto('/home')}
    >
      <Icon icon="chair" />
      <span>Home</span>
    </button>
    <button
      name="Worldfeed"
      data-flex="v cc"
      class:active={$page.route.id === '/(public)/worldfeed'}
      on:click={() => goto('/worldfeed')}
    >
      <Icon icon="travel_explore" />
      <span>Worldfeed</span>
    </button>
    {#if $page.data.my_nametag}
      <button
        name="Create"
        data-flex="v cc"
        class:active={$page.route.id?.startsWith('/(private)/post') ||
          $page.route.id?.startsWith('/(private)/pocket') ||
          $page.route.id?.startsWith('/(private)/status')}
      >
        <Icon icon="draw" />
        <span>Create</span>
        <select
          value=""
          data-sham
          on:change={(e) => {
            goto(e.currentTarget.value);
            e.currentTarget.value = '';
          }}
        >
          <optgroup label="Create:">
            <option value="/post">New Post</option>
            <!-- <option value="/status">New Status</option> -->
            <option value="/pocket">New Pocket</option>
          </optgroup>
        </select>
      </button>

      <button
        name="Inbox"
        data-flex="v cc"
        on:click={() => goto('/inbox')}
        class:active={$page.route?.id === '/(private)/inbox'}
      >
        <Icon icon="campaign" />
        <span>Inbox</span>
        {#if $Notifications.unread_count > 0}
          <span class="count">
            {$Notifications.unread_count}
          </span>
        {/if}
      </button>
      <button
        name="My profile"
        data-flex="v cc"
        on:click={() => {
          $page.data.my_nametag && goto(`/profile/${$page.data.my_nametag?.id}`);
        }}
        class:active={$page.data.my_nametag &&
          $page.url.pathname === `/profile/${$page.data.my_nametag.id}`}
      >
        <Icon icon="face" />
        <span>Me</span>
      </button>
    {:else}
      <button
        name="Get a free account"
        data-flex="v cc"
        on:click={() => ($App.sheet_id = 'onboarding')}
        class="double active"
        data-fill="base"
      >
        <Icon icon="face" />
        <span>Sign up <em class="half">or</em> Sign in</span>
      </button>
    {/if}
  </nav>
</div>

<style lang="scss">
  div {
    position: fixed;
    bottom: 0;
    width: 100vw;
    z-index: 4000;
    border-top: 1px solid rgb(var(--superdark));
  }

  nav {
    padding-bottom: calc(env(safe-area-inset-bottom));
    z-index: 150;
    max-width: 640px;
    margin: auto;

    &:has(.double) {
      button:not(:last-child) {
        margin-right: 1rem;
      }
    }
  }

  button {
    width: 78px;
    height: 78px;
    color: rgb(var(--superlight));
    opacity: 0.5;
    transition: all 0.1s ease-in-out;
    border: 0 none;
    position: relative;

    &.double {
      flex-grow: 1;
      // width: 156px;
      border-radius: 1rem;
    }

    span {
      font-size: 14px;

      &.count {
        padding: 0 0.25rem;
        border-radius: 0.5rem;
        overflow: hidden;
        position: absolute;
        transform: translate(1.111rem, -1.111rem);
        background-color: rgb(var(--base));
        border: 1px solid rgb(var(--superdark));
        min-width: 1rem;
        max-width: 60px;
        height: 1rem;
        line-height: calc(1rem - 4px);
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    &:active {
      transform: translate(-1px, 1px);
    }

    &.active {
      color: #fff;
      opacity: 1;
      font-weight: bold;
    }
  }
</style>
