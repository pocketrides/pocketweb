<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import UtilityNav from '$lib/components/UtilityNav.svelte';
  import { App } from '$lib/stores/app';

  $App.fill = 'superlight';
</script>

<SiteHeader />
<Main>
  <h1 class="h2">Welcome to pocketrides!</h1>
  <p>The best new place on the internet.</p>
  <UtilityNav slot="utility-nav">
    <div slot="left">
      <Button
        label="Get an account!"
        system={true}
        on:click={() => ($App.sheet_id = 'onboarding')}
      />
    </div>
  </UtilityNav>
</Main>
