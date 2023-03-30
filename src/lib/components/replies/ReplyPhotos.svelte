<script lang="ts">
  import { Photos } from '$lib/stores/gallery';
  import type { DraftPhotosMessage } from '$lib/zod/Message';
  import CloudinaryImg from '../CloudinaryImg.svelte';

  export let message: DraftPhotosMessage;
</script>

<div data-flex="scroll-h" data-gap data-padded="h">
  {#each message.photos as photo (photo)}
    <div
      data-3d="ah"
      on:mouseup={() => {
        $Photos = {
          photos: message.photos,
          selected: photo
        };
      }}
    >
      <CloudinaryImg {photo} square_small />
    </div>
  {/each}
</div>

<style lang="scss">
  [data-flex='scroll-h'] {
    scroll-padding: 0 1rem;
  }

  [data-3d] {
    max-width: 128px;
    flex-shrink: 0;
    scroll-snap-align: start;

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
</style>
