<script lang="ts">
  import type { ServerNametag } from '$lib/zod/Nametag';

  export let nametag: Partial<ServerNametag>;

  export let small: boolean = false;
  export let large: boolean = false;
</script>

{#if nametag.nametag}
  <a
    href={nametag.id ? `/profile/${nametag.id}` : undefined}
    data-theme={nametag.theme}
    data-3d
    on:click
    class:normal={!small && !large}
    class:small
    class:large
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
    display: inline-flex;
    align-items: center;
    user-select: none;
  }

  .normal {
    height: 32px;
    padding: 0 0.5rem;
  }

  .small {
    height: 28px;
    padding: 0 0.25rem;
  }

  .large {
    height: 42px;
  }
</style>
