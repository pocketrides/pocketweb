<script lang="ts">
  import {
    AddPostToRequest,
    type AddPostToListResponse
  } from '$lib/api/post/add_to';
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Radio from '$lib/components/Radio.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import { App } from '$lib/stores/app';
  import { AddPostTo } from '$lib/stores/post';
  import { writable } from 'svelte/store';

  let promise: Promise<AddPostToListResponse>;
  let publish_target: string; // pocket:{id}

  const is_publishing = writable(false);
  const publish_error = writable(false);
  const almost_done = writable(false);

  const activate = async () => {
    if ($AddPostTo.post_id) {
      promise = AddPostToRequest.list($AddPostTo.post_id);
    }
  };

  const dismiss = () => {
    $AddPostTo.post_id = undefined;
    $is_publishing = false;
    $publish_error = false;
    $almost_done = false;
  };

  const addClick = async () => {
    $is_publishing = true;

    let pocket_id = publish_target ? publish_target.split(':')[1] : undefined;

    if ($AddPostTo.post_id && pocket_id) {
      const res = await AddPostToRequest.addTo($AddPostTo.post_id, pocket_id);

      $publish_error = res.success === false;

      if (!$publish_error) {
        $is_publishing = false;
        $almost_done = true;
        setTimeout(() => {
          $App.sheet_id = '';
        }, 1000);
      }
    }
  };
</script>

<Sheet
  id="add_post_to"
  header="Add to…"
  icon="add_circle"
  on:activate={activate}
  on:dismiss={dismiss}
  nav_height={115}
>
  {#await promise}
    <h3>One sec…</h3>
  {:then list}
    {#if list}
      <div data-flex="v" data-gap>
        <h2>Pockets:</h2>
        {#each list.pockets as pocket (pocket)}
          <Radio
            bind:group={publish_target}
            value={`pocket:${pocket.id}`}
            icon="hail"
            label={pocket.name_raw.replace(/\n/g, ' ')}
            xlarge
          />
        {/each}
        {#each list.cohosted_pockets as pocket (pocket)}
          <Radio
            bind:group={publish_target}
            value={`pocket:${pocket.id}`}
            icon="hail"
            label={pocket.name_raw.replace(/\n/g, ' ')}
            xlarge
          />
        {/each}
        {#each list.unlisted_pockets as pocket (pocket)}
          <Radio
            bind:group={publish_target}
            value={`pocket:${pocket.id}`}
            icon="hail"
            label={pocket.name_raw.replace(/\n/g, ' ')}
            xlarge
          />
        {/each}
        {#each list.joined_pockets as pocket (pocket)}
          <Radio
            bind:group={publish_target}
            value={`pocket:${pocket.id}`}
            icon="hail"
            label={pocket.name_raw.replace(/\n/g, ' ')}
            xlarge
          />
        {/each}
      </div>
    {/if}
  {/await}
  <div slot="nav" data-fill="system-superlight">
    <Container padded>
      <div data-flex="v" data-gap>
        <Button
          label={$is_publishing
            ? $almost_done
              ? 'Done!'
              : 'Adding…'
            : 'Add to Pocket'}
          icon="add_circle"
          primary
          xlarge
          disabled={!publish_target || $is_publishing}
          on:click={addClick}
        />
        {#if $publish_error}
          <p data-error>Something went wrong! Try again?</p>
        {/if}
      </div>
    </Container>
  </div>
</Sheet>
