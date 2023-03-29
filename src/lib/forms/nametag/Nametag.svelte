<script lang="ts">
  import { NametagList, type NametagListResponse } from '$lib/api/nametag/list';
  import { NametagUse } from '$lib/api/nametag/use';
  import Button from '$lib/components/Button.svelte';
  import { type SheetContext, SHEET_CONTEXT_ID } from '$lib/contexts/Sheet';
  import { type WorkflowContext, WORKFLOW_CONTEXT_ID } from '$lib/contexts/Workflow';
  import type { ClientNametag, ServerNametag } from '$lib/zod/Nametag';
  import { createEventDispatcher, getContext, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import NewNametag from './NewNametag.svelte';

  const dispatch = createEventDispatcher();
  const context = getContext<SheetContext>(SHEET_CONTEXT_ID);
  const workflow_context = getContext<WorkflowContext>(WORKFLOW_CONTEXT_ID);
  const loading = writable(true);

  const available_nametags = writable<NametagListResponse>({
    success: true,
    nametags: [],
    collabs: []
  });

  $workflow_context.loading = true;

  onMount(async () => {
    const list_result = await NametagList.get();

    if (list_result.success) {
      $available_nametags = list_result;
    }

    if (
      list_result.success &&
      list_result.nametags.length === 1 &&
      list_result.collabs.length === 0
    ) {
      const use_result = await NametagUse.post({
        nametag_id: list_result.nametags[0].id
      });

      if (use_result.success) {
        dispatch('complete', {
          first_time: false,
          nametag_id: list_result.nametags[0].id
        });
      } else needsInput();
    } else needsInput();
  });

  const nametagClick = async (nametag: ServerNametag | ClientNametag) => {
    $loading = true;
    $workflow_context.loading = true;

    const use = await NametagUse.post({
      nametag_id: nametag.id
    });

    if (use.success) {
      dispatch('complete', {
        first_time: false,
        nametag_id: nametag.id
      });
    } else {
      $loading = false;
      $workflow_context.loading = false;
    }
  };

  const needsInput = () => {
    $context.header =
      $available_nametags.success && $available_nametags.nametags.length
        ? 'Which Nametag?'
        : 'Create your nametag';
    $context.icon = 'face';
    $context.dismissable = false;
    $workflow_context.loading = false;
    $loading = false;
  };
</script>

{#if $available_nametags.success && $available_nametags.nametags.length === 0}
  {#if $loading === false}
    <NewNametag on:complete />
  {/if}
{:else if $available_nametags.success}
  {#if $loading === false}
    <div data-flex="v" data-gap="1">
      <div data-flex="v" data-gap>
        <h2 class="h3 half">Your Nametags:</h2>
        <div data-flex="vs" data-gap>
          {#each $available_nametags.nametags as nametag (nametag)}
            <Button
              label={nametag.nametag}
              primary
              jumbo
              theme={nametag.theme}
              on:click={() => {
                nametagClick(nametag);
              }}
            />
          {/each}
        </div>
      </div>
      {#if $available_nametags.collabs.length}
        <div data-flex="v" data-gap>
          <h2 class="h3 half">Collabs:</h2>
          <div data-flex="vs" data-gap>
            {#each $available_nametags.collabs as collab (collab)}
              <Button
                label={collab.nametag.nametag}
                primary
                jumbo
                theme={collab.nametag.theme}
                on:click={() => {
                  nametagClick(collab.nametag);
                }}
              />
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
{/if}
