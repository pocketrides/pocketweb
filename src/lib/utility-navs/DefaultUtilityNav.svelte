<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import ButtonRow from '$lib/components/ButtonRow.svelte';
  import UtilityNav from '$lib/components/UtilityNav.svelte';
  import { App } from '$lib/stores/app';
</script>

<UtilityNav>
  <p class="h3" slot="left">Pocketrides: it's a brave new world bb</p>
  <div slot="right">
    <ButtonRow initial="learn_more" let:controller>
      <Button
        id="learn_more"
        {controller}
        href="/"
        label="Learn more"
        icon="help_outline"
        primary
      />
      <Button
        id="get_account"
        {controller}
        label="Get an account"
        icon="hail"
        large
        on:click={() => {
          $App.sheet_id = 'onboarding';
        }}
      />
    </ButtonRow>
  </div>
</UtilityNav>
