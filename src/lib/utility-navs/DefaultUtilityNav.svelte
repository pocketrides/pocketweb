<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import ButtonRow from '$lib/components/ButtonRow.svelte';
  import UtilityNav from '$lib/components/UtilityNav.svelte';
  import { App } from '$lib/stores/app';
</script>

<UtilityNav>
  <div slot="left">
    <div data-flex="as v" data-gap>
      <h2 class="h3">
        You're on Pocketrides! <strong class="half">Hello!</strong>
      </h2>
      <ButtonRow let:controller initial="learn_more">
        <Button
          href="/"
          id="learn_more"
          label="What is this?"
          icon="touch_app"
          icon_filled
          primary
          {controller}
        />
        <Button
          id="get_account"
          label="Sign up or Sign in"
          large
          icon="hail"
          {controller}
          on:click={() => {
            $App.sheet_id = 'onboarding';
          }}
        />
      </ButtonRow>
    </div>
  </div>
</UtilityNav>

<style lang="scss">
  @media (min-width: 640px) {
    [data-flex] {
      align-items: center;
      text-align: center;
    }
  }
</style>
