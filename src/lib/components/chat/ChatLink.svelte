<script lang="ts">
  import type { DraftLinksMessage } from '$lib/zod/Message';
  import LinkDisplay from '../LinkDisplay.svelte';

  export let message: DraftLinksMessage;
</script>

<div data-padded>
  <LinkDisplay link={message.link} mini />
</div>
