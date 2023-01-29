<script lang="ts">
  import { page } from '$app/stores';
  import WorkflowItem from '$lib/components/WorkflowItem.svelte';
  import Workflow from '$lib/components/Workflow.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import Stytch from '$lib/forms/stytch/Stytch.svelte';
  import Nametag from '$lib/forms/nametag/Nametag.svelte';
  import Subscription from '$lib/forms/subscription/Subscription.svelte';
  import Terms from '$lib/forms/terms/Terms.svelte';
  import { App } from '$lib/stores/app';
  import { goto, invalidateAll } from '$app/navigation';
</script>

<Sheet id="onboarding">
  <Workflow initial="stytch">
    <WorkflowItem name="stytch" component={Stytch} next="terms" />
    <WorkflowItem name="terms" component={Terms} next="nametag" />
    <WorkflowItem name="nametag" component={Nametag} next="subscription" />
    <WorkflowItem
      name="subscription"
      component={Subscription}
      on:complete={async () => {
        if ($page.url.pathname === '/') await goto('/home');
        else await invalidateAll();

        $App.sheet_id = '';
      }}
    />
  </Workflow>
</Sheet>
