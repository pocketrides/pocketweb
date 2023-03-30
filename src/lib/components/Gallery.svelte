<script lang="ts">
  import type { CloudinaryPhoto } from '$lib/zod/CloudinaryPhoto';
  import { writable } from 'svelte/store';
  import CloudinaryImg from './CloudinaryImg.svelte';

  export let photos: CloudinaryPhoto[];
  export let square: boolean = true;

  let gallery: HTMLDivElement;

  const current_scroll = writable(1);

  const handleScroll = () => {
    $current_scroll = Math.max(
      1,
      Math.floor(gallery.scrollLeft / gallery.clientWidth) + 1
    );
  };
</script>

{#if photos.length}
  <div class="gallery-outer" class:square>
    <div
      class="gallery"
      data-flex={photos.length === 1 ? 'cc' : 'scroll-h'}
      bind:this={gallery}
      on:scroll={handleScroll}
    >
      {#each photos as photo (photo)}
        <div class="gallery-item" data-flex="cc">
          <CloudinaryImg
            {photo}
            square={square === true}
            normal={square === false}
          />
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
  :global(header) .gallery-outer {
    border-bottom-right-radius: 1rem;
    border-bottom-left-radius: 1rem;
  }

  .gallery-outer {
    overflow: hidden;

    &.square {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom: 0;
    }

    .gallery-item {
      max-width: 720px;
      max-height: 640px;
      // min-width: 50%;
      scroll-snap-align: center !important;
      min-height: 320px;

      @media (max-width: 640px) {
        min-width: 100%;
      }

      :global(img) {
        // width: 100%;
        min-width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

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
