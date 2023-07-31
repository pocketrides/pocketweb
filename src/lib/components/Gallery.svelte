<script lang="ts">
  import type { CloudinaryPhoto } from '$lib/zod/CloudinaryPhoto';
  import { createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';
  import CloudinaryImg from './CloudinaryImg.svelte';
  import FloatButton from './FloatButton.svelte';
  import FloatButtonContainer from './FloatButtonContainer.svelte';
  import { Photos } from '$lib/stores/gallery';
  import { browser } from '$app/environment';

  export let photos: CloudinaryPhoto[];
  export let square: boolean = true;
  export let contain: boolean = false;
  export let allow_delete: boolean = false;

  let gallery: HTMLDivElement;
  let w = (browser && window.innerWidth) || 0;

  const dispatch = createEventDispatcher();
  const current_scroll = writable(1);

  const handleScroll = () => {
    if (!gallery) return;

    $current_scroll = Math.min(
      photos.length,
      Math.max(1, Math.floor(gallery.scrollLeft / gallery.offsetWidth) + 1)
    );
  };

  const itemClick = (photo: CloudinaryPhoto) => {
    $Photos = {
      photos,
      selected: photo
    };
  };

  const handleResize = () => {
    w = window.innerWidth;
    handleScroll();
  };

  // test mode
  // photos = [
  //   {
  //     public_id: 'Y9bSrRZTjCkcZz2so6Ofd',
  //     version: 1680545132,
  //     aws_rek_status: 'approved',
  //     alt_text: ''
  //   },
  //   {
  //     public_id: 'W4-yXrMGctYVG0fwtmvmA',
  //     version: 1680543327,
  //     aws_rek_status: 'approved',
  //     alt_text: ''
  //   }
  // ];
</script>

<svelte:window on:resize={handleResize} />

{#if photos.length}
  <div class="gallery-outer" class:square class:contain>
    <div
      class="gallery"
      data-flex="scroll-h"
      bind:this={gallery}
      on:scroll={handleScroll}
    >
      {#each photos as photo (photo)}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          class="gallery-item"
          data-flex="ac jc"
          on:mouseup={(e) => {
            // @ts-ignore
            if (e.target.nodeName === 'IMG') itemClick(photo);
          }}
        >
          <CloudinaryImg
            {photo}
            square={square === true}
            normal={square === false}
          />
          {#if allow_delete}
            <FloatButtonContainer position="inner_center_bottom">
              <FloatButton
                icon="delete"
                on:click={() => {
                  dispatch('delete', photo);
                }}
              />
            </FloatButtonContainer>
          {/if}
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
  .gallery-outer {
    overflow: hidden;
    border-bottom-right-radius: 1rem;
    border-bottom-left-radius: 1rem;

    &.square {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom: 0;
    }

    &:not(.contain) .gallery-item {
      scroll-snap-align: center !important;
      flex-shrink: 0;
      flex-grow: 0;
      min-width: 100%;
      // height: 100vh;
      max-width: 720px;
      max-height: 645px;
      overflow: hidden;

      :global(img) {
        height: 100%;
        min-width: 100%;
        max-height: 645px;
        object-fit: cover;

        @media (min-width: 640px) {
          max-height: none;
          max-width: 720px;
        }
      }

      &:has(img.landscape) {
        min-width: auto;
        min-height: 645px;

        :global(img) {
          min-height: 645px;
          max-height: 645px;

          @media (min-width: 640px) {
            max-height: 645px;
            max-width: none;
          }
        }
      }
    }

    &.square .gallery-item {
      flex-shrink: 0;
      aspect-ratio: 1/1;
      width: 100vw;
      height: 100vw;
      min-width: 100%;
      max-width: 640px;
      min-height: 100%;
      max-height: 640px;
      scroll-snap-align: center;
      overflow: hidden;

      :global(img) {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &.contain .gallery-item {
      flex-shrink: 0;
      width: 100%;
      aspect-ratio: 1/1;
      max-width: 640px;
      max-height: 640px;

      :global(img) {
        width: 100%;
        height: 100%;
        object-fit: contain;
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
