<script lang="ts">
  import { App } from '$lib/stores/app';
  import type { CloudinaryPhoto } from '$lib/zod/CloudinaryPhoto';
  import { createEventDispatcher } from 'svelte';
  import CloudinaryImg from './CloudinaryImg.svelte';
  import FloatButton from './FloatButton.svelte';
  import FloatButtonContainer from './FloatButtonContainer.svelte';

  export let photo: CloudinaryPhoto;

  const dispatch = createEventDispatcher();

  const infoClick = () => {
    $App.sheet_id = 'has_rejected_media';
  };

  const deleteClick = () => {
    dispatch('delete', photo);
  };
</script>

<div class="wrapper">
  <FloatButtonContainer>
    <div>
      {#if photo.aws_rek_status === 'rejected'}
        <FloatButton icon="info" fill="superdark" on:click={infoClick} />
      {/if}
    </div>
    <FloatButton icon="delete" on:click={deleteClick} />
  </FloatButtonContainer>
  <div data-3d data-flex="cc">
    <CloudinaryImg {photo} square />
  </div>
</div>

<style lang="scss">
  .wrapper,
  [data-3d] {
    position: relative;
    width: 128px;
    height: 128px;
  }

  [data-3d] {
    overflow: hidden;
    padding: 0;

    :global(img) {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
</style>
