<script lang="ts">
  import { AddLinkRequest } from '$lib/api/link/add';
  import { createEventDispatcher } from 'svelte';
  import { writable, type Writable } from 'svelte/store';
  import { z } from 'zod';
  import Button from './Button.svelte';

  export let controller: Writable<string>;
  export let large: boolean = false;

  const dispatch = createEventDispatcher();
  const adding = writable(false);
  const try_again = writable(false);

  const handleClick = async () => {
    let link = prompt('Paste a link:');

    if (link) {
      $adding = true;

      if (/^http/i.test(link) === false) link = `https://${link}`;

      const valid = z.string().url().safeParse(link);

      if (valid.success) {
        const res = await AddLinkRequest.post({ link });

        if (res.success && res.link) {
          $try_again = false;
          $adding = false;
          dispatch('added', res.link);
        } else {
          // it's fine it just couldn't get a preview
          $try_again = false;
          $adding = false;
          dispatch('added', {
            url: link
          });
        }
      } else {
        $try_again = true;
        $adding = false;
      }
    }
  };
</script>

{#if $adding}
  <Button disabled icon="autorenew" icon_spins label="Adding…" {large} />
{:else}
  <Button
    id="add_links"
    label={$try_again ? 'Try again' : 'Add link'}
    icon="add_link"
    {controller}
    {large}
    on:click={handleClick}
  />
{/if}
