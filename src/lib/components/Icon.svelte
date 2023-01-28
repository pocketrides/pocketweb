<script lang="ts">
  export let icon: string | undefined;
  export let filled: boolean = false;
  export let half: boolean = false;
</script>

{#if icon}
  <span
    class:material-icons-outlined={!filled}
    class:material-icons={filled}
    class:half
  >
    {icon}
  </span>
{/if}
