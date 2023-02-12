<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import MarkdownEditor from '$lib/components/MarkdownEditor.svelte';
  import {
    blankPostContent,
    MAX_POST_CONTENT_LENGTH,
    type DraftPostContent
  } from '$lib/zod/Post';
  import { nanoid } from 'nanoid';
  import { writable } from 'svelte/store';
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
  <div data-flex="v">
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
  <div data-flex="sb">
    <div data-button-row>
      <div data-3d-container>
        {#if $button_row === 'add_pics'}
          <input type="file" data-sham />
        {/if}
        <Button
          id="add_pics"
          label="Add pics"
          icon="add_photo_alternate"
          controller={button_row}
        />
      </div>
      <Button
        id="add_links"
        label="Add links"
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
