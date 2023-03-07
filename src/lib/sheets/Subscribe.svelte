<script lang="ts">
  import Sheet from '$lib/components/Sheet.svelte';
  import Subscription from '$lib/forms/subscription/Subscription.svelte';
  import { App } from '$lib/stores/app';

  const completed = () => {
    $App.sheet_id = '';
  };
</script>

<Sheet id="subscribe" icon="favorite" header="Subscribe">
  <Subscription on:complete={completed} />
</Sheet>
