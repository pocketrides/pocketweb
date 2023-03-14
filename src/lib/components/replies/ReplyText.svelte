<script lang="ts">
  import type { DraftTextMessage } from '$lib/zod/Message';

  export let message: DraftTextMessage;
</script>

<div data-padded>
  <div data-richtext data-flex="as">{@html message.content}</div>
</div>

<style lang="scss">
  [data-richtext] {
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    background-color: rgba(var(--superlight), 0.5);
  }
</style>
