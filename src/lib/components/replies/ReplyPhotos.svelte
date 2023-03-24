<script lang="ts">
  import type { DraftPhotosMessage } from '$lib/zod/Message';
  import CloudinaryImg from '../CloudinaryImg.svelte';

  export let message: DraftPhotosMessage;
</script>

<div data-flex="scroll-h" data-gap>
  {#each message.photos as photo (photo)}
    <div data-3d="ah">
      <CloudinaryImg {photo} />
    </div>
  {/each}
</div>
