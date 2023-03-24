<script lang="ts">
  import type { Link } from '$lib/zod/Link';
  import { createEventDispatcher } from 'svelte';
  import FloatButton from './FloatButton.svelte';
  import FloatButtonContainer from './FloatButtonContainer.svelte';
  import LinkDisplay from './LinkDisplay.svelte';

  export let link: Link;

  const dispatch = createEventDispatcher();

  const handleDeleteClick = () => {
    dispatch('delete', link);
  };
</script>

<div>
  <FloatButtonContainer>
    <FloatButton icon="delete" on:click={handleDeleteClick} />
  </FloatButtonContainer>
  <LinkDisplay {link} />
</div>
