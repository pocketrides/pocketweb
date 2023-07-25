<script lang="ts">
  export let summary: string;
</script>

<details data-richtext>
  <summary class="strong">{summary}</summary>
  <slot />
</details>

<style lang="scss">
  summary {
    cursor: pointer;
  }
</style>
