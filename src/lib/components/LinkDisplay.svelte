<script lang="ts">
  import type { Link } from '$lib/zod/Link';
  import { onMount } from 'svelte';
  import Icon from './Icon.svelte';

  export let link: Link;
  export let mini: boolean = false;

  let url = new URL(link.url);

  let sanitize: DOMPurify.DOMPurifyI['sanitize'];

  onMount(async () => {
    const lib = await import('dompurify');

    sanitize = lib.default.sanitize;
  });
</script>

<div data-3d="ah" data-fill="base" class:mini data-flex={mini ? '' : 'v'}>
  {#if link.og_image}
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      class="og-image"
      aria-label={`${link.og_desc || ' '} (link to ${url.hostname})`}
    >
      <img src={link.og_image} alt="" />
    </a>
  {/if}
  <a
    href={link.url}
    target="_blank"
    rel="noreferrer"
    data-flex="v cc"
    data-gap="0"
    class="og-link"
  >
    <h3 class="nowraps">{link.og_title || url.host + url.pathname}</h3>
    <p class="small half nowraps">{link.og_desc || url.host}</p>
  </a>
</div>

<style lang="scss">
  [data-3d] {
    max-width: 220px;
    flex-shrink: 0;
    overflow: hidden;
    position: relative;

    .og-image {
      overflow: hidden;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center top;
      }
    }

    .og-link {
      padding: 0.5rem;
      text-decoration: none;
    }

    &:not(.mini) .og-image {
      width: 100%;
      aspect-ratio: 16/9;
      border-bottom-right-radius: 0.25rem;
      border-bottom-left-radius: 0.25rem;
      border-bottom: 1px solid rgba(var(--dark), 0.85);
    }

    &.mini {
      max-width: none;

      .og-link {
        max-width: 220px;
        min-height: 42px;
        padding: 0 0.5rem;
      }

      .og-image {
        max-height: 42px;
        aspect-ratio: 1/1;
        border-top-right-radius: 0.25rem;
        border-bottom-right-radius: 0.25rem;
        border-right: 1px solid rgba(var(--dark), 0.85);
      }
    }
  }
</style>
