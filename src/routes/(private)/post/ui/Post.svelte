<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import CloudinaryPreview from '$lib/components/CloudinaryPreview.svelte';
  import MarkdownEditor from '$lib/components/MarkdownEditor.svelte';
  import type { CloudinaryPhoto } from '$lib/zod/CloudinaryPhoto';
  import {
    blankPostContent,
    MAX_POST_CONTENT_LENGTH,
    type DraftPostContent
  } from '$lib/zod/Post';
  import { nanoid } from 'nanoid';
  import { writable } from 'svelte/store';
  import AddPics from './AddPics.svelte';
  import type { PageControllerStore } from './types';

  export let store: PageControllerStore;
  export let post: DraftPostContent;
  export let index: number;

  const label_id = nanoid();
  const button_row = writable('');

  const addPost = () => {
    store.update((prev) => {
      prev.contents.splice(index + 1, 0, blankPostContent());

      return prev;
    });

    $button_row = '';
  };

  const handlePicsUploaded = (e: CustomEvent<CloudinaryPhoto[]>) => {
    store.update((prev) => {
      if (prev.contents[index].photos) {
        prev.contents[index].photos.push(...e.detail);
      } else {
        prev.contents[index].photos = e.detail;
      }

      return prev;
    });
  };

  const handleDeletePhoto = (e: CustomEvent<CloudinaryPhoto>) => {
    store.update((prev) => {
      const photo_index = prev.contents[index].photos.findIndex((photo) => {
        return photo.public_id === e.detail.public_id;
      });

      prev.contents[index].photos.splice(photo_index, 1);

      return prev;
    });
  };

  const discard = () => {
    store.update((prev) => {
      prev.contents.splice(index, 1);
      return prev;
    });
  };

  $: if (post.content.length > MAX_POST_CONTENT_LENGTH) {
    $button_row = 'add_more';
  }
</script>

<div data-flex="v" data-gap>
  {#if post.photos.length}
    <div class="photos-wrapper" data-flex data-gap>
      {#each post.photos as photo (photo)}
        <CloudinaryPreview {photo} on:delete={handleDeletePhoto} />
      {/each}
    </div>
  {/if}
  <div data-flex="v" data-padded="vh">
    <label for={label_id} class="h3">
      {#if index === 0}What's up?{/if}
    </label>
    <MarkdownEditor
      id={label_id}
      bind:value={post.content}
      bind:raw={post.content_raw}
      too_long="Too long! Say more in another post."
      placeholder={index === 0 ? 'Tell everyone' : 'Keep writing!'}
    />
  </div>
  <div data-flex="sb" data-padded="h">
    <div data-button-row>
      <AddPics controller={button_row} on:uploaded={handlePicsUploaded} />
      <Button
        id="add_links"
        label="Add link"
        icon="add_link"
        controller={button_row}
      />
      <Button
        id="add_more"
        label="Add more"
        icon="post_add"
        on:click={addPost}
        controller={button_row}
      />
    </div>
    <div data-button-row>
      {#if $store.contents.length > 1}
        <Button
          id="discard"
          label="Discard"
          icon="delete"
          controller={button_row}
          on:click={discard}
        />
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  .photos-wrapper {
    padding: 2rem 1rem 1px;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: visible;
  }
</style>
