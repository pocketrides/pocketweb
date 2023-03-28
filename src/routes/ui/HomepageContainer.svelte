<script lang="ts">
  import Container from '$lib/components/Container.svelte';
</script>

<Container padded bordered rounded>
  <div data-flex="v" data-gap>
    <slot />
  </div>
</Container>
