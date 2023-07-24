<script lang="ts">
  export let icon: string | undefined;
  export let filled: boolean = false;
  export let half: boolean = false;
  export let spins: boolean = false;
  export let inline: boolean = false;
  export let small: boolean = false;
  export let multiline: boolean = false;
  export let bold: boolean = false;
</script>

{#if icon}
  <span
    class="material-symbols-rounded"
    class:filled
    class:half
    class:spins
    class:inline
    class:small
    class:multiline
    class:bold
  >
    {icon}
  </span>
{/if}

<style lang="scss">
  span {
    max-width: 1em;
    font-weight: 500;
    font-size: 1.222em;
  }

  @keyframes icon-spins {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  .spins {
    animation: icon-spins 1.5s linear infinite;
  }

  .filled {
    font-variation-settings: 'FILL' 1;
  }

  .bold {
    font-weight: 800;
  }
</style>
