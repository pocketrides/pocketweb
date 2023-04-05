<script lang="ts">
  import AddLink from '$lib/components/AddLink.svelte';
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import LinkPreview from '$lib/components/LinkPreview.svelte';
  import Row from '$lib/components/Row.svelte';
  import type { Link } from '$lib/zod/Link';
  import type { DraftPocket } from '$lib/zod/Pocket';
  import { onMount } from 'svelte';
  import { writable, type Writable } from 'svelte/store';
  import { page_label } from '../store';

  export let page_controller: Writable<DraftPocket>;

  const controller = writable('add_links');

  onMount(() => {
    if (!$page_controller.details.links) {
      $page_controller.details.links = [];
    }
  });

  const deleteClick = () => {
    page_controller.update((prev) => {
      prev.details_enabled.splice(prev.details_enabled.indexOf('links'), 1);
      delete prev.details.links;
      return prev;
    });
  };

  const handleDeleteLink = (e: CustomEvent<Link>) => {
    page_controller.update((prev) => {
      if (prev.details.links) {
        const link_index = prev.details.links.findIndex((l) => {
          return l === e.detail;
        });

        if (link_index !== -1) prev.details.links.splice(link_index, 1);
      }

      return prev;
    });
  };

  const handleLinkAdded = (e: CustomEvent<Link>) => {
    page_controller.update((prev) => {
      if (prev.details.links) {
        prev.details.links.push(e.detail);
      } else {
        prev.details.links = [e.detail];
      }

      return prev;
    });
  };
</script>

<Container bottombordered padded={false}>
  <div data-flex="v">
    <Row padded>
      <h2 slot="left">
        <Icon icon="link" />
        Links
      </h2>
      <Button
        slot="right"
        icon="delete"
        label="Remove"
        on:click={deleteClick}
        controller={page_label}
      />
    </Row>
    {#if $page_controller.details.links && $page_controller.details.links.length}
      <div class="links-wrapper" data-flex="scroll-h ae" data-gap data-padded>
        {#each $page_controller.details.links as link (link)}
          <LinkPreview {link} on:delete={handleDeleteLink} />
        {/each}
      </div>
    {/if}
    <div data-padded data-flex="v as" data-gap>
      <AddLink {controller} large on:added={handleLinkAdded} />
      {#if !$page_controller.details.links || $page_controller.details.links.length === 0}
        <p class="h3 half">Add at least one link.</p>
      {/if}
    </div>
  </div>
</Container>

<style lang="scss">
  .links-wrapper {
    scroll-padding: 0 1rem;
  }

  .links-wrapper :global(> *) {
    scroll-snap-align: start;
  }
</style>
