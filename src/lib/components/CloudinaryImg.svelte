<script lang="ts">
  import {
    getNormal,
    getSquare,
    getSquareSmall,
    getThumbnail
  } from '$lib/util/cloudinary';
  import type { CloudinaryPhoto } from '$lib/zod/CloudinaryPhoto';

  export let photo: CloudinaryPhoto;

  export let thumbnail: boolean = false;
  export let normal: boolean = false;
  export let square: boolean = false;
  export let square_small: boolean = false;
</script>

{#if thumbnail === true}
  <img
    on:mouseup
    data-thumbnail
    src={getThumbnail(photo.version, photo.public_id)}
    alt={photo.alt_text}
  />
{/if}
{#if normal === true}
  <img
    on:mouseup
    data-normal
    src={getNormal(photo.version, photo.public_id)}
    alt={photo.alt_text}
  />
{/if}
{#if square === true}
  <img
    on:mouseup
    data-square
    src={getSquare(photo.version, photo.public_id)}
    alt={photo.alt_text}
  />
{/if}
{#if square_small === true}
  <img
    on:mouseup
    data-square-sm
    src={getSquareSmall(photo.version, photo.public_id)}
    alt={photo.alt_text}
  />
{/if}
