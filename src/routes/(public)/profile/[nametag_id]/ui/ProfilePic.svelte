<script lang="ts">
  import CloudinaryImg from '$lib/components/CloudinaryImg.svelte';
  import type { CloudinaryPhoto } from '$lib/zod/CloudinaryPhoto';

  export let profile_pic: CloudinaryPhoto | undefined | null;
</script>

{#if profile_pic}
  <div data-3d data-inert data-flex>
    <CloudinaryImg photo={profile_pic} square />
  </div>
{/if}

<style lang="scss">
  [data-3d] {
    padding: 0;
    flex: 1;
    aspect-ratio: 1/1;
    max-width: 140px;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
</style>
