<script lang="ts">
  import WorkflowItem from '$lib/components/WorkflowItem.svelte';
  import Workflow from '$lib/components/Workflow.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import Stytch from '$lib/forms/stytch/Stytch.svelte';
  import Nametag from '$lib/forms/nametag/Nametag.svelte';
  // import Subscription from '$lib/forms/subscription/Subscription.svelte';
  import Terms from '$lib/forms/terms/Terms.svelte';
  import { App } from '$lib/stores/app';
  import { invalidateAll } from '$app/navigation';
  import { IDBCache } from '$lib/util/idb-cache';
  import { IDBFeedCache } from '$lib/util/idb-feed-cache';

  const nametagComplete = async (
    e: CustomEvent<{ first_time: boolean; nametag_id: string }>
  ) => {
    await IDBCache.clear();
    await IDBFeedCache.clear();

    if (e.detail.first_time === true && location.href === '/') {
      $App.sheet_id = '';
      location.href = `/profile/${e.detail.nametag_id}`;
    } else {
      await invalidateAll();
      $App.sheet_id = '';
    }
  };
</script>

<Sheet id="onboarding">
  <Workflow initial="stytch">
    <WorkflowItem name="stytch" component={Stytch} next="terms" />
    <WorkflowItem name="terms" component={Terms} next="nametag" />
    <WorkflowItem name="nametag" component={Nametag} on:complete={nametagComplete} />
    <!-- <WorkflowItem
      name="subscription"
      component={Subscription}
      on:complete={async () => {
        // done is dispatched when 'no thanks' is clicked
        await invalidateAll();

        $App.sheet_id = '';
      }}
    /> -->
  </Workflow>
</Sheet>
