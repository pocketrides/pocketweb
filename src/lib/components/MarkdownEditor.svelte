<script lang="ts">
  import { dompurify_config } from '$lib/util/dompurify';
  import { MAX_POST_CONTENT_LENGTH } from '$lib/zod/Post';
  import type DOMPurify from 'dompurify';
  import { marked } from 'marked';
  import { onMount } from 'svelte';

  export let id: string;
  export let value: string = '';
  export let raw: string = '';
  export let placeholder = 'Tell everyone';
  export let too_long = 'Too long!';
  export let max_len: number = MAX_POST_CONTENT_LENGTH;
  export let class_override: string | undefined = undefined;

  let sanitize: DOMPurify.DOMPurifyI['sanitize'];
  let editing = false;

  onMount(async () => {
    const lib = await import('dompurify');
    // @ts-ignore
    const tables = await import('marked-extended-tables');

    sanitize = lib.default.sanitize;

    marked.use(tables.default());
  });

  $: if (sanitize) {
    value = sanitize(
      marked.parse(raw, {
        breaks: true,
        silent: true,
        smartypants: true,
        gfm: true
      }),
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
      class={class_override || ''}
    />
    <article data-richtext class={class_override || ''}>
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
  :global([data-fill='base']) textarea {
    color: rgb(var(--allwhite));

    &::placeholder {
      color: rgba(var(--allwhite), 0.5);
    }
  }

  div {
    position: relative;

    &[data-error] {
      margin-top: 0;
      align-self: flex-start;
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
    // line-height: 1.5;
  }

  // textarea,
  // [data-richtext] {
  //   &:not([class*='h']) {
  // font-size: 1.115rem;
  // line-height: 1.5;
  //   }
  // }

  // article {
  // padding-bottom: 1.5rem;
  // }

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
