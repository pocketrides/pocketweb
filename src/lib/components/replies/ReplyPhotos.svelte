<script lang="ts">
  import type { DraftPhotosMessage } from '$lib/zod/Message';
  import CloudinaryImg from '../CloudinaryImg.svelte';

  export let message: DraftPhotosMessage;
</script>

<div data-flex="scroll-h" data-gap data-padded="h">
  {#each message.photos as photo (photo)}
    <div data-3d="ah">
      <CloudinaryImg {photo} square_small />
    </div>
  {/each}
</div>

<style lang="scss">
  [data-3d] {
    max-width: 128px;

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
</style>
