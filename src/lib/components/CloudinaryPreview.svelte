<script lang="ts">
  import type { CloudinaryPhoto } from '$lib/zod/CloudinaryPhoto';
  import { createEventDispatcher } from 'svelte';
  import CloudinaryImg from './CloudinaryImg.svelte';
  import DeleteButton from './DeleteButton.svelte';

  export let photo: CloudinaryPhoto;

  const dispatch = createEventDispatcher();

  const deleteClick = () => {
    dispatch('delete', photo);
  };
</script>

<div class="wrapper" data-fill="base">
  <DeleteButton on:click={deleteClick} />
  <div data-3d>
    <CloudinaryImg {photo} square_small />
  </div>
</div>

<style lang="scss">
  .wrapper {
    position: relative;
    width: 128px;
    height: 128px;
    aspect-ratio: 1/1;
  }

  [data-3d] {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 0;
  }
</style>
