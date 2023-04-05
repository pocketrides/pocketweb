<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import MarkdownEditor from '$lib/components/MarkdownEditor.svelte';
  import Row from '$lib/components/Row.svelte';
  import type { DraftPocket } from '$lib/zod/Pocket';
  import type { Writable } from 'svelte/store';
  import { page_label } from '../store';

  export let page_controller: Writable<DraftPocket>;

  let raw: string = $page_controller.details.desc_raw || '';
  let value: string = $page_controller.details.desc_html || '';

  $: $page_controller.details.desc_raw = raw;
  $: $page_controller.details.desc_html = value;

  const deleteClick = () => {
    page_controller.update((prev) => {
      prev.details_enabled.splice(prev.details_enabled.indexOf('desc'), 1);
      delete prev.details.desc_html;
      delete prev.details.desc_raw;

      return prev;
    });
  };
</script>

<Container bottombordered>
  <div data-flex="v" data-gap>
    <Row>
      <h2 slot="left">
        <Icon icon="description" />
        <label for="desc"> Description </label>
      </h2>
      <Button
        slot="right"
        icon="delete"
        label="Remove"
        on:click={deleteClick}
        controller={page_label}
      />
    </Row>
    <MarkdownEditor
      id="desc"
      bind:raw
      bind:value
      placeholder="Start typing…"
      class_override="h2"
    />
  </div>
</Container>
