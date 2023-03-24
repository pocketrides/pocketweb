<script lang="ts">
  export let padded: boolean = false;
</script>

<div data-flex="scroll-h ae" data-gap data-padded={padded ? '' : undefined}>
  <slot />
</div>
