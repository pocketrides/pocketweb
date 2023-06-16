<script lang="ts">
  import {
    draft_message_text_validator,
    type DraftTextMessage
  } from '$lib/zod/Message';
  import { nanoid } from 'nanoid';
  import { createEventDispatcher, onMount } from 'svelte';
  import type DOMPurify from 'dompurify';
  import { dompurify_config } from '$lib/util/dompurify';

  import { marked } from 'marked';
  import Button from '../Button.svelte';
  import { writable } from 'svelte/store';

  export let message: DraftTextMessage;
  export let placeholder: string = `Write a message…`;
  export let can_delete = false;
  export let controller = writable('');
  export let autofocus: boolean = false;
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher();

  let id = nanoid();
  let sanitize: DOMPurify.DOMPurifyI['sanitize'];
  let editing = false;
  let textarea: HTMLTextAreaElement | undefined;

  onMount(async () => {
    const lib = await import('dompurify');

    sanitize = lib.default.sanitize;

    if (autofocus && textarea) textarea.focus();
  });

  $: if (sanitize) {
    message.content = sanitize(
      marked.parse(message.content_raw, {
        breaks: true,
        silent: true,
        smartypants: true
      }),
      dompurify_config
    ) as string;
  }

  $: valid = draft_message_text_validator.safeParse(message).success;

  const keydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && (e.shiftKey || e.altKey || e.metaKey) === false) {
      e.preventDefault();
      dispatch('submit');
    }
  };

  const focus = () => {
    editing = true;
  };

  const blur = () => {
    editing = false;
  };

  const deleteClick = () => {
    dispatch('delete', message);
  };
</script>

<div class="grow" data-flex="ae" data-gap>
  <div class="grow" class:editing>
    <label for={id} class="vh">{placeholder}</label>
    <textarea
      {id}
      bind:this={textarea}
      bind:value={message.content_raw}
      on:keydown={keydown}
      on:focus={focus}
      on:blur={blur}
      on:focus
      on:blur
      data-sham
      data-3d
      data-richtext
      {placeholder}
      {disabled}
      class:filled={valid}
      class:active={editing}
    />
    <!-- svelte-ignore a11y-role-supports-aria-props -->
    <article data-3d class:filled={valid} data-richtext aria-disabled={disabled}>
      {#if valid}
        {@html message.content}
      {:else}
        <span class="half">{placeholder}</span>
      {/if}
    </article>
  </div>
  {#if can_delete}
    <div>
      <Button
        {id}
        label="Delete"
        icon="delete"
        {controller}
        {disabled}
        on:click={deleteClick}
      />
    </div>
  {/if}
</div>

<style lang="scss">
  .grow {
    flex: 1;
  }

  textarea,
  article {
    min-height: 42px;
    padding: 0.5rem;

    &[data-3d] {
      height: auto;
    }
  }

  article:not([data-3d]) {
    padding: 0.5rem 0;
  }

  .editing textarea {
    opacity: 1;
  }

  .editing article {
    opacity: 0;
  }
</style>
