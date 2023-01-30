<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';

  export let profile_pic: string | undefined;
</script>

<div class="container" data-flex="cc" data-fill="system-superlight" data-3d>
  <div class="shim" data-flex="v cc">
    <p class="h1 half">
      <Icon icon="face" />
    </p>
    <p class="h3 half">Upload pic</p>
    <input type="file" />
    {#if profile_pic}
      <div class="img" style={`background-image:url('${profile_pic}')`} />
    {/if}
  </div>
</div>

<style lang="scss">
  .container,
  .shim,
  .img {
    width: 150px;
    height: 150px;
  }

  .container {
    padding: 0;

    overflow: hidden;
  }

  .shim {
    position: relative;
  }

  input,
  .img {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .img {
    pointer-events: none;
    background-position: center center;
    background-size: cover;
    opacity: 1;
  }
</style>
