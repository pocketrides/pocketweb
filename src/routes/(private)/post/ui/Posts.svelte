<script lang="ts">
  import Post from './Post.svelte';
  import type { PageControllerStore } from './types';

  export let store: PageControllerStore;
</script>

<div data-flex="v" data-gap="1">
  {#each $store.contents as post, index (post)}
    <Post {store} {index} bind:post />
  {/each}
</div>

<style lang="scss">
  div {
    padding-bottom: 1rem;
  }
</style>
