<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { NametagCreate } from '$lib/api/nametag/create';
  import { NametagList } from '$lib/api/nametag/list';
  import { NametagUse } from '$lib/api/nametag/use';
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Nametag from '$lib/components/Nametag.svelte';
  import { type SheetContext, SHEET_CONTEXT_ID } from '$lib/contexts/Sheet';
  import { type WorkflowContext, WORKFLOW_CONTEXT_ID } from '$lib/contexts/Workflow';
  import { App } from '$lib/stores/app';
  import { draft_nametag_validator } from '$lib/zod/Nametag';
  import { THEME_NAMES, THEME_VALUES, type ThemeValue } from '$lib/zod/Theme';
  import { createEventDispatcher, getContext, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { slide } from 'svelte/transition';

  let nametag: string = '';
  let theme: ThemeValue | '' = '';

  $: valid = draft_nametag_validator.safeParse({ nametag, theme }).success;

  const dispatch = createEventDispatcher();
  const context = getContext<SheetContext>(SHEET_CONTEXT_ID);
  const workflow_context = getContext<WorkflowContext>(WORKFLOW_CONTEXT_ID);
  const loading = writable(true);
  const submitting = writable(false);

  $workflow_context.loading = true;

  const themeChange = () => {
    if (theme !== '') $App.theme = theme;
    else $App.theme = 'system';
  };

  onMount(async () => {
    const list_result = await NametagList.get();

    if (list_result.success && list_result.nametags.length > 0) {
      const use_result = await NametagUse.post({
        nametag_id: list_result.nametags[0].id
      });

      if (use_result.success) {
        dispatch('complete');
        await invalidateAll();
      } else needsInput();
    } else needsInput();
  });

  const needsInput = () => {
    $context.header = 'Create your nametag';
    $context.icon = 'face';
    $context.dismissable = false;
    $workflow_context.loading = false;
    $loading = false;
  };

  const handleSubmit = async () => {
    if (!valid || theme === '') return;

    $submitting = true;

    const result = await NametagCreate.post({ nametag, theme });

    if (result.success === true) {
      dispatch('complete');
    }
  };
</script>

{#if $loading === false}
  <form on:submit|preventDefault={handleSubmit} data-flex="v" data-gap>
    <div>
      <h2>Nametags aren't usernames, they're better.</h2>
      <p>Add some emojis, pick your favorite color, have fun with it.</p>
    </div>
    {#if nametag !== ''}
      <Container rounded fill="superlight">
        <div class="preview" data-flex="v" data-gap in:slide out:slide>
          <Nametag
            style="jumbo"
            nametag={{ nametag, theme: theme === '' ? undefined : theme }}
            on:click={(e) => {
              e.preventDefault();
            }}
          />
          {#if theme === ''}
            <p class="half">Add some color,<br />pick a theme!</p>
          {:else}
            <p class="h3"><em>It's you!</em></p>
          {/if}
        </div>
      </Container>
    {/if}
    <div data-flex data-gap>
      <div data-flex="v">
        <label for="nametag" class="h3">Nametag:</label>
        <input
          type="text"
          bind:value={nametag}
          class:filled={nametag !== ''}
          data-3d
          class="h3"
        />
      </div>

      <div data-flex="v">
        <label for="theme" class="h3">Theme:</label>
        <select
          bind:value={theme}
          data-3d
          class="h3"
          class:filled={theme !== ''}
          on:change={themeChange}
        >
          <option value="">Pick!</option>
          {#each THEME_NAMES as name, i}
            <option value={THEME_VALUES[i]}>{name}</option>
          {/each}
        </select>
      </div>
    </div>
    <div data-flex>
      <Button
        type="submit"
        primary
        disabled={!valid || $submitting}
        label={$submitting ? 'One sec!' : 'Continue…'}
      />
    </div>
  </form>
{/if}

<style lang="scss">
  .preview {
    padding: 0 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;

    p {
      text-align: center;
    }
  }
</style>
