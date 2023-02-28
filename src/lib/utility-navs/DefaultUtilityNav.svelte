<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import ButtonRow from '$lib/components/ButtonRow.svelte';
  import UtilityNav from '$lib/components/UtilityNav.svelte';
  import { App } from '$lib/stores/app';
</script>

<UtilityNav>
  <div class="h3" slot="left"><p>Pocketrides is<br />better social media.</p></div>
  <div slot="right">
    <ButtonRow initial="learn_more" let:controller>
      <Button
        id="get_account"
        {controller}
        label="Join now"
        icon="hail"
        large
        on:click={() => {
          $App.sheet_id = 'onboarding';
        }}
      />
      <Button
        id="learn_more"
        {controller}
        href="/"
        label="Learn more"
        icon="help_outline"
        primary
      />
    </ButtonRow>
  </div>
</UtilityNav>
