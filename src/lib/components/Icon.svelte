<script lang="ts">
  export let icon: string | undefined;
  export let filled: boolean = false;
  export let half: boolean = false;
  export let spins: boolean = false;
  export let inline: boolean = false;
</script>

{#if icon}
  <span
    class:material-icons-outlined={!filled}
    class:material-icons={filled}
    class:half
    class:spins
    class:inline
  >
    {icon}
  </span>
{/if}

<style lang="scss">
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
</style>
