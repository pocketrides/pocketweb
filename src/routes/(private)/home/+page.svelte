<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import ButtonRow from '$lib/components/ButtonRow.svelte';
  import Main from '$lib/components/Main.svelte';
  import Post from '$lib/components/Post.svelte';
  import ScrollList from '$lib/components/ScrollList.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import UtilityNav from '$lib/components/UtilityNav.svelte';
  import { App } from '$lib/stores/app';
  import { writable } from 'svelte/store';
  import type { PageData } from './$types';

  export let data: PageData;

  if (data.page_theme) $App.theme = data.page_theme;
  $App.fill = 'superlight';

  const button_row = writable('');
</script>

<svelte:head>
  <title>pocketrides!</title>
</svelte:head>

<SiteHeader outer_fill="system-superlight" />
<Main padded={false}>
  <ScrollList>
    {#each data.post_ids as post_id}
      <Post {post_id} />
    {/each}
  </ScrollList>
  <UtilityNav slot="utility-nav">
    <div slot="left">
      <ButtonRow>
        <Button
          id="new_post"
          icon="signpost"
          label="New post"
          primary
          controller={button_row}
          href="/post"
        />
        <Button
          id="new_status"
          icon="airline_stops"
          label="New status"
          controller={button_row}
          large
        />
        <Button
          id="new_pocket"
          icon="hail"
          label="New pocket"
          controller={button_row}
          large
        />
      </ButtonRow>
    </div>
  </UtilityNav>
</Main>
