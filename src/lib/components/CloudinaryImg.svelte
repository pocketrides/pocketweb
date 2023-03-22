<script lang="ts">
  import { getNormal, getSquare, getThumbnail } from '$lib/util/cloudinary';
  import type { CloudinaryPhoto } from '$lib/zod/CloudinaryPhoto';

  export let photo: CloudinaryPhoto;

  export let thumbnail: boolean = false;
  export let normal: boolean = false;
  export let square: boolean = false;
</script>

{#if thumbnail}
  <img
    data-thumbnail
    src={getThumbnail(photo.version, photo.public_id)}
    alt={photo.alt_text}
  />
{/if}
{#if normal}
  <img
    data-normal
    src={getNormal(photo.version, photo.public_id)}
    alt={photo.alt_text}
  />
{/if}
{#if square}
  <img
    data-square
    src={getSquare(photo.version, photo.public_id)}
    alt={photo.alt_text}
  />
{/if}
