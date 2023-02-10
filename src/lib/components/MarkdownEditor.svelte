<script lang="ts">
  import { dompurify_config } from '$lib/util/dompurify';
  import { MAX_POST_CONTENT_LENGTH } from '$lib/zod/Post';
  import type DOMPurify from 'dompurify';
  import { marked } from 'marked';
  import { onMount } from 'svelte';

  export let id: string;
  export let value: string = '';
  export let placeholder = 'Tell everyone';
  export let too_long = 'Too long!';
  export let max_len: number = MAX_POST_CONTENT_LENGTH;

  let sanitize: DOMPurify.DOMPurifyI['sanitize'];
  let raw: string = '';
  let editing = false;

  onMount(async () => {
    const lib = await import('dompurify');

    sanitize = lib.default.sanitize;
  });

  $: if (sanitize) {
    value = sanitize(
      marked.parse(raw, { breaks: true, silent: true, smartypants: true }),
      dompurify_config
    ) as string;
  }

  const focus = () => {
    editing = true;
  };

  const blur = () => {
    editing = false;
  };
</script>

<div data-flex="v" data-gap>
  <div class:editing>
    <textarea
      {id}
      {placeholder}
      spellcheck="true"
      bind:value={raw}
      on:focus={focus}
      on:blur={blur}
    />
    <article data-richtext>
      {#if value === ''}
        <p class="half">{placeholder}</p>
      {:else}
        {@html value}
      {/if}
    </article>
  </div>
  {#if value.length > max_len - 20}
    <div
      class="h3"
      data-error={value.length > max_len ? '' : undefined}
      class:half={value.length < max_len - 10}
    >
      {#if value.length <= max_len}
        {value.length}/{max_len}
      {:else}
        {too_long}
      {/if}
    </div>
  {/if}
</div>

<style lang="scss">
  div {
    position: relative;

    &[data-error] {
      margin-top: 0;
    }
  }

  textarea {
    position: absolute;
    z-index: 1;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  article {
    // padding-bottom: 1.5rem;
  }

  article,
  textarea {
    min-height: 4rem;
  }

  .editing {
    textarea {
      opacity: 1;
    }

    article {
      opacity: 0;
    }
  }
</style>
