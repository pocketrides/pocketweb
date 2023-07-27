<script lang="ts">
  import type { ClientNametag, ServerNametag } from '$lib/zod/Nametag';

  export let nametag: Partial<ServerNametag> | ClientNametag;

  export let small: boolean = false;
  export let large: boolean = false;
  export let tiny: boolean = false;
</script>

{#if nametag.nametag}
  <a
    data-nametag
    href={nametag.id ? `/profile/${nametag.id}` : undefined}
    data-theme={nametag.theme}
    data-3d
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
