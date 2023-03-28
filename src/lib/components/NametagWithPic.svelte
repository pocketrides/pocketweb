<script lang="ts">
  import { getSquareSmall } from '$lib/util/cloudinary';
  import type { ClientNametag, ServerNametag } from '$lib/zod/Nametag';
  import Nametag from './Nametag.svelte';

  export let nametag: Partial<ServerNametag> | ClientNametag;

  export let small: boolean = false;
  export let large: boolean = false;
  export let tiny: boolean = false;
</script>

<div
  data-flex
  data-button-row
  class:normal={!small && !large && !tiny}
  class:small
  class:large
  class:tiny
>
  {#if nametag.profile_pic && !tiny}
    <a href={nametag.id} data-3d="ah">
      <img
        src={getSquareSmall(
          nametag.profile_pic.version,
          nametag.profile_pic.public_id
        )}
        alt=""
      />
    </a>
  {/if}
  <Nametag {nametag} {small} {large} {tiny} />
</div>

<style lang="scss">
  img {
    vertical-align: top;
  }

  [data-button-row].large {
    img {
      width: 40px;
      height: 40px;
    }
  }

  [data-button-row].small,
  [data-button-row].normal {
    img {
      width: 30px;
      height: 30px;
    }
  }
</style>
