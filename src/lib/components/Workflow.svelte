<script lang="ts">
  import { WORKFLOW_CONTEXT_ID, type WorkflowContext } from '$lib/contexts/Workflow';
  import { App } from '$lib/stores/app';
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  export let initial: string;

  const context = setContext<WorkflowContext>(
    WORKFLOW_CONTEXT_ID,
    writable({
      initial,
      current: initial,
      loading: false
    })
  );

  $App.loading = $context.loading;
</script>

<section>
  <slot />
  {#if $context.loading}
    <div class="loading h3">Just a sec!</div>
  {/if}
</section>

<style lang="scss">
  section {
    display: flex;
    flex-wrap: nowrap;
    position: relative;
  }

  .loading {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    min-height: 420px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
