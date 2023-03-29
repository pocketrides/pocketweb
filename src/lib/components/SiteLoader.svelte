<script lang="ts">
  import { App } from '$lib/stores/app';
</script>

{#if $App.loading}
  <div class="loader" data-fill="dark">
    <div data-fill="base" class="indicator" />
  </div>
{/if}

<style lang="scss">
  @keyframes loader {
    0% {
      transform: translateX(-10vw);
      width: 10%;
    }

    50% {
      width: 50%;
    }

    100% {
      transform: translateX(110vw);
      width: 10%;
    }
  }

  .loader {
    position: fixed;
    width: 100vw;
    overflow: hidden;
    top: 0;
    z-index: 75;
    height: 2px;

    .indicator {
      position: relative;
      height: 2px;
      animation: 1s loader infinite ease-in-out;
    }
  }
</style>
