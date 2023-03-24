<script lang="ts">
  import type { Link } from '$lib/zod/Link';
  import { onMount } from 'svelte';
  import Icon from './Icon.svelte';

  export let link: Link;

  let url = new URL(link.url);

  let sanitize: DOMPurify.DOMPurifyI['sanitize'];

  onMount(async () => {
    const lib = await import('dompurify');

    sanitize = lib.default.sanitize;
  });
</script>

<a data-3d="ah" data-fill="base" href={link.url} target="_blank" rel="noreferrer">
  {#if link.og_image}
    <span class="image-wrapper" data-fill="light">
      <img src={link.og_image} alt="" />
    </span>
  {/if}
  <span class="wrapper">
    {#if link.og_title && typeof sanitize !== 'undefined'}
      <span class="h3">{@html sanitize(link.og_title)}</span>
    {:else}
      <span class="h3 link-only">
        <Icon icon="link" />
        {url.host}
      </span>
    {/if}
    {#if link.og_desc && typeof sanitize !== 'undefined'}
      <small>{@html sanitize(link.og_desc)}</small>
    {:else}
      <small>{url.host + url.pathname}</small>
    {/if}
  </span>
</a>

<style lang="scss">
  a {
    max-width: 220px;
    max-height: 12rem;
    display: block;
    overflow: hidden;

    text-decoration: none;

    .image-wrapper {
      display: block;
      overflow: hidden;
      max-height: 115px;

      img {
        width: 100%;
      }
    }

    .wrapper {
      display: inline-block;
      padding: 0.5rem;

      .h3,
      small {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        text-overflow: ellipsis;
      }

      .h3.link-only {
        display: inline-flex;

        :global([class*='material']) {
          font-size: 1em;
        }
      }
    }
  }
</style>
