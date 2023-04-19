<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import ButtonRow from '$lib/components/ButtonRow.svelte';
  import Container from '$lib/components/Container.svelte';
  import type { DraftPocket } from '$lib/zod/Pocket';
  import type { Writable } from 'svelte/store';
  import { page_label } from './store';

  export let page_controller: Writable<DraftPocket>;

  const addTimeClick = () => {
    page_controller.update((prev) => {
      prev.details_enabled.push('time');
      return prev;
    });
  };

  const addPlaceClick = () => {
    page_controller.update((prev) => {
      prev.details_enabled.push('place');
      return prev;
    });
  };

  const addLinkClick = () => {
    page_controller.update((prev) => {
      prev.details_enabled.push('links');
      return prev;
    });
  };

  const addDescClick = () => {
    page_controller.update((prev) => {
      prev.details_enabled.push('desc');
      return prev;
    });
  };
</script>

<Container>
  <div data-flex="v" data-gap>
    <div>
      {#if $page_controller.details_enabled.length === 0}
        <p class="h3 half">Optional</p>
        <h2>Add details:</h2>
      {:else}
        <h2>Add more details:</h2>
      {/if}
    </div>
    <ButtonRow
      initial={$page_controller.details_enabled.indexOf('time') < 0
        ? 'time'
        : $page_controller.details_enabled.indexOf('place') < 0
        ? 'place'
        : $page_controller.details_enabled.indexOf('links') < 0
        ? 'links'
        : 'desc'}
    >
      {#if $page_controller.details_enabled.indexOf('time') < 0}
        <Button
          id="time"
          label="Date"
          icon="event"
          controller={page_label}
          large
          on:click={addTimeClick}
        />
      {/if}
      {#if $page_controller.details_enabled.indexOf('place') < 0}
        <Button
          id="place"
          label="Location"
          icon="place"
          controller={page_label}
          large
          on:click={addPlaceClick}
        />
      {/if}
      {#if $page_controller.details_enabled.indexOf('desc') < 0}
        <Button
          id="desc"
          label="Description"
          icon="description"
          controller={page_label}
          large
          on:click={addDescClick}
        />
      {/if}
      {#if $page_controller.details_enabled.indexOf('links') < 0}
        <Button
          id="links"
          label="Links"
          icon="link"
          controller={page_label}
          large
          on:click={addLinkClick}
        />
      {/if}
    </ButtonRow>
  </div>
</Container>
