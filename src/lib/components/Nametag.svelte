<script lang="ts">
  import type { ServerNametag } from '$lib/zod/Nametag';

  export let nametag: Partial<ServerNametag>;
  export let style: 'normal' | 'small' | 'jumbo' = 'normal';
</script>

{#if nametag.nametag}
  <div style="display:contents" data-theme={nametag.theme}>
    <a
      href={nametag.id ? `/profile/${nametag.id}` : undefined}
      on:click
      class:normal={style === 'normal'}
      class:small={style === 'small'}
      class:jumbo={style === 'jumbo'}
      class:h2={style === 'jumbo'}
      class:h3={style !== 'jumbo'}
      data-fill={nametag.theme ? 'base' : 'system-superlight'}
    >
      {nametag.nametag}
    </a>
  </div>
{/if}

<style lang="scss">
  a {
    text-decoration: none;
    display: inline-flex;
    font-weight: bold;
    align-items: center;
    user-select: none;
  }

  .normal,
  .small,
  .jumbo {
    border-radius: 0.25rem;
    border: 1px solid rgb(var(--dark));
    box-shadow: -1px 1px rgb(var(--dark));
  }

  .normal:active,
  .small:active,
  .jumbo:active {
    box-shadow: none;
    transform: translate(-1px, 1px);
  }

  .normal {
    height: 32px;
    padding: 0 0.5rem;
  }

  .small {
    height: 28px;
    padding: 0 0.25rem;
  }

  .jumbo {
    height: 42px;
    padding: 0 0.75rem;
  }
</style>
