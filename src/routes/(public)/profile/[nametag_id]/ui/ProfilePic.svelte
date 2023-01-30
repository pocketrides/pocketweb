<script lang="ts">
  export let profile_pic: string | undefined;
</script>

{#if profile_pic}
  <div
    style={`background-image: url("${profile_pic}")`}
    data-fill="system-superlight"
  />
{/if}

<style lang="scss">
  div {
    padding: 0;
    width: 150px;
    height: 150px;
    overflow: hidden;
    background-position: center center;
    background-size: cover;
  }
</style>
