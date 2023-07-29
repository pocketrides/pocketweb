<script lang="ts">
  export let summary: string;
  export let half: boolean = false;
  export let small: boolean = false;
</script>

<details data-richtext={small ? undefined : ''} class:half class:small>
  <summary class="strong">{summary}</summary>
  <slot />
</details>

<style lang="scss">
  summary {
    cursor: pointer;
  }
</style>
