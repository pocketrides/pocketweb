<script lang="ts">
  import type { CloudinaryPhoto } from '$lib/zod/CloudinaryPhoto';
  import { writable } from 'svelte/store';
  import CloudinaryImg from './CloudinaryImg.svelte';

  export let photos: CloudinaryPhoto[];
  export let square: boolean = true;

  let gallery: HTMLDivElement;

  const current_scroll = writable(1);

  const handleScroll = () => {
    $current_scroll = Math.floor(gallery.scrollLeft / gallery.clientWidth) + 1;
  };
</script>

{#if photos.length}
  <div class="gallery-outer">
    <div
      class="gallery"
      class:square
      data-flex
      bind:this={gallery}
      on:scroll={handleScroll}
    >
      {#each photos as photo (photo)}
        <div class="gallery-item" data-flex="cc">
          <CloudinaryImg {photo} square />
        </div>
      {/each}
    </div>
    {#if photos.length > 1}
      <div class="marker h3 half" data-fill="dark" data-flex="cc">
        <small>{$current_scroll}/{photos.length}</small>
      </div>
    {/if}
  </div>
{/if}

<style lang="scss">
  .gallery {
    overflow-x: auto;
    scroll-snap-type: x mandatory;

    &.square .gallery-item {
      flex-shrink: 0;
      width: 100vw;
      height: 100vw;
      max-width: 640px;
      max-height: 640px;
      scroll-snap-align: center;
      overflow: hidden;

      :global(img) {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .gallery-outer {
    position: relative;

    .marker {
      position: absolute;
      left: 1rem;
      bottom: 1rem;
      min-width: 32px;
      padding: 0 0.25rem;
      height: 32px;
      text-align: center;
      border-radius: 24px;
      z-index: 1;
    }
  }
</style>
