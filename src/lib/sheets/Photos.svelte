<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import CloudinaryImg from '$lib/components/CloudinaryImg.svelte';
  import UtilityNav from '$lib/components/UtilityNav.svelte';
  import { Photos } from '$lib/stores/gallery';
  import { afterUpdate, beforeUpdate, onDestroy } from 'svelte';

  let dialog: HTMLDialogElement;

  beforeUpdate(() => {
    if ($Photos.photos.length && !dialog.open) {
      dialog.showModal();
    }
  });

  afterUpdate(() => {
    if (!$Photos.photos.length && dialog.open) {
      dialog.close();
    }

    if ($Photos.selected) {
      const el = dialog.querySelector(
        `[data-photo="${$Photos.selected.public_id}"]`
      );

      if (el) {
        setTimeout(() => {
          el.scrollIntoView();
        }, 25);
      }

      $Photos.selected = undefined;
    }
  });

  onDestroy(() => {
    $Photos = {
      photos: []
    };
  });

  const closed = () => {
    $Photos = {
      photos: [],
      selected: undefined
    };
  };

  const checkScroll = (e: any) => {
    const el = e.target as HTMLElement;

    if (el.scrollTop < -50) {
      $Photos = {
        photos: [],
        selected: undefined
      };
    }
  };
</script>

<dialog bind:this={dialog} on:cancel={closed} on:scroll={checkScroll}>
  {#if $Photos.photos.length}
    <ul data-flex="scroll-h" data-unstyle>
      {#each $Photos.photos as photo}
        <li data-photo={photo.public_id} data-flex="cc">
          <CloudinaryImg {photo} normal />
        </li>
      {/each}
    </ul>
    <UtilityNav border_bottom={false}>
      <div slot="left">
        <Button
          label="Close"
          on:click={() => {
            $Photos = {
              photos: [],
              selected: undefined
            };
          }}
        />
      </div>
    </UtilityNav>
  {/if}
</dialog>

<style lang="scss">
  dialog {
    display: none;
  }

  dialog[open] {
    display: block;

    &::backdrop {
      background: rgba(var(--allblack), 1);
    }

    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    max-width: none;
    max-height: none;
    margin: 0;
    padding: 0;
    border: 0;
    background: rgba(var(--allblack), 1);

    :global([data-util-nav]) {
      position: fixed;
      bottom: 0;
      width: 100%;
    }
  }

  ul {
    width: 100vw;
    height: calc(100vh - 5rem);

    li {
      width: 100%;
      height: 100%;
      flex-shrink: 0;

      :global(img) {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
</style>
