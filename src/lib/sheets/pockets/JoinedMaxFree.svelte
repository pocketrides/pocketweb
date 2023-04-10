<script lang="ts">
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import Subscription from '$lib/forms/subscription/Subscription.svelte';
  import { App } from '$lib/stores/app';

  const completed = () => {
    $App.sheet_id = '';
  };
</script>

<Sheet id="joined_max_free_pockets" header="Subscription required" icon="hail">
  <div data-flex="v" data-gap="1">
    <Container>
      <h2>
        <Icon icon="info" />
        You're out of pockets.
      </h2>
      <p>You can join up to three pockets without a subscription.</p>
    </Container>
    <Subscription on:complete={completed} />
  </div>
</Sheet>
