<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import ButtonRow from '$lib/components/ButtonRow.svelte';
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import UtilityNav from '$lib/components/UtilityNav.svelte';
  import { App } from '$lib/stores/app';
  import { writable } from 'svelte/store';

  $App.fill = 'superlight';

  const button_row = writable('');
</script>

<svelte:head>
  <title>pocketrides!</title>
</svelte:head>

<SiteHeader />
<Main>
  <h1>Welcome home!</h1>

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
