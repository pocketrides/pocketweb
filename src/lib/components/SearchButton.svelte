<script lang="ts">
  import { App } from '$lib/stores/app';
  import Button from './Button.svelte';
</script>

<Button
  label=""
  icon="search"
  icon_bold
  no_underline
  transparent
  on:click={() => {
    $App.sheet_id = 'search';
  }}
/>
