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
        You're on Pocketrides! Hello! <span class="thin">
          We're a social network doing things a whole lot of different.
        </span>
      </h2>
      <ButtonRow let:controller initial="learn_more">
        <Button
          href="/"
          id="learn_more"
          label="Learn more"
          icon="touch_app"
          icon_filled
          primary
          {controller}
        />
        <Button
          id="get_account"
          label="Get free account"
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

    h2 {
      max-width: 80%;
    }
  }
</style>
