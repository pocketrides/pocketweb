<script lang="ts">
  import {
    getNormal,
    getSquare,
    getSquareSmall,
    getThumbnail
  } from '$lib/util/cloudinary';
  import type { CloudinaryPhoto } from '$lib/zod/CloudinaryPhoto';
  import { onMount } from 'svelte';

  export let photo: CloudinaryPhoto;

  export let thumbnail: boolean = false;
  export let normal: boolean = false;
  export let square: boolean = false;
  export let square_small: boolean = false;

  let landscape: boolean = false;

  let imgEl: HTMLImageElement;

  onMount(() => {
    imgLoad(undefined);
  });

  const imgLoad = (e: Event | undefined) => {
    if (!imgEl && e) imgEl = e.target as HTMLImageElement;
    if (!imgEl && !e) return;

    const aspect = imgEl.naturalWidth / imgEl.naturalHeight;

    landscape = aspect.toFixed(3) === `1.333`;
  };
</script>

{#if thumbnail === true}
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <img
    on:mouseup
    data-thumbnail
    src={getThumbnail(photo.version, photo.public_id)}
    alt={photo.alt_text}
  />
{/if}
{#if normal === true}
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <img
    on:load={imgLoad}
    bind:this={imgEl}
    class:landscape
    on:mouseup
    data-normal
    src={getNormal(photo.version, photo.public_id)}
    alt={photo.alt_text}
  />
{/if}
{#if square === true}
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <img
    on:mouseup
    data-square
    src={getSquare(photo.version, photo.public_id)}
    alt={photo.alt_text}
  />
{/if}
{#if square_small === true}
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <img
    on:mouseup
    data-square-sm
    src={getSquareSmall(photo.version, photo.public_id)}
    alt={photo.alt_text}
  />
{/if}
