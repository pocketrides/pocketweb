<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { slide } from 'svelte/transition';
  import Icon from './Icon.svelte';
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
      class:active={$page.route.id == '/(public)/worldfeed'}
      on:click={() => goto('/worldfeed')}
    >
      <Icon icon="travel_explore" />
      <span>Worldfeed</span>
    </button>
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
          <option value="/status">New Status</option>
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
    </button>
    <button
      name="My profile"
      data-flex="v cc"
      on:click={() =>
        $page.data.my_nametag && goto(`/profile/${$page.data.my_nametag?.id}`)}
      class:active={$page.data.my_nametag &&
        $page.url.pathname === `/profile/${$page.data.my_nametag.id}`}
    >
      <Icon icon="face" />
      <span>Me</span>
    </button>
  </nav>
</div>

<style lang="scss">
  div {
    position: fixed;
    bottom: 0;
    width: 100vw;
    z-index: 400;
  }

  nav {
    padding-bottom: calc(env(safe-area-inset-bottom));
    z-index: 150;
    border-top: 1px solid rgb(var(--superdark));
    max-width: 640px;
    margin: auto;
  }

  button {
    width: 20vw;
    max-width: 82px;
    height: 20vw;
    max-height: 82px;
    color: rgb(var(--superlight));
    opacity: 0.5;
    transition: all 0.1s ease-in-out;

    span {
      font-size: 14px;
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
