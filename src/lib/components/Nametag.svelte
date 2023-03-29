<script lang="ts">
  import type { ClientNametag, ServerNametag } from '$lib/zod/Nametag';

  export let nametag: Partial<ServerNametag> | ClientNametag;

  export let small: boolean = false;
  export let large: boolean = false;
  export let tiny: boolean = false;
</script>

{#if nametag.nametag}
  <a
    href={nametag.id ? `/profile/${nametag.id}` : undefined}
    data-theme={nametag.theme}
    data-3d={tiny ? '' : ''}
    on:click
    class:normal={!small && !large && !tiny}
    class:small
    class:large
    class:tiny
    class:h2={large}
    class:h3={!large}
    data-fill={nametag.theme ? 'base' : 'system-superlight'}
  >
    {nametag.nametag}
  </a>
{/if}

<style lang="scss">
  a {
    text-decoration: none;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    user-select: none;
    white-space: nowrap;
    max-width: 220px;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .normal {
    height: 32px;
    padding: 0 0.5rem;
  }

  .tiny {
    height: 28px;
    padding: 0 6px;
    border: 1px solid rgba(var(--dark), 0.5);
    border-radius: 3px;
    box-shadow: 0 0 4px 0 rgba(var(--base), 0.5);
    // background-color: rgba(var(--superlight), 0.85);
    // font-weight: 300;
    font-size: 0.875rem;
  }

  .small {
    height: 28px;
    padding: 0 0.25rem;
  }

  .large {
    height: 42px;
  }
</style>
