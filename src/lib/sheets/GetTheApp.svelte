<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Help from '$lib/components/Help.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import { App } from '$lib/stores/app';
  import {
    THEME_NAMES,
    THEME_SYSTEM,
    THEME_VALUES,
    type ThemeAnyValue
  } from '$lib/zod/Theme';

  let selected_theme: ThemeAnyValue = $App.theme;
  $: $App.theme = selected_theme;
</script>

<Sheet id="get_the_app" header="Get the app" icon="add_to_home_screen">
  <div data-flex="v" data-gap="1">
    <div data-flex="v cc" data-gap>
      <div data-flex="v cc">
        <div data-icon data-flex="cc">
          <img src={`/pocketrides-${selected_theme}.png`} alt="" width="70" />
        </div>
        <small class="half">pocketrides!</small>
      </div>
      <div data-flex="ac" data-gap>
        <Button label="Customize icon" icon="unfold_more">
          <select bind:value={selected_theme} data-sham>
            <option value={THEME_SYSTEM}>Default</option>
            {#each THEME_NAMES as value, index}
              <option value={THEME_VALUES[index]}>{value}</option>
            {/each}
          </select>
        </Button>
      </div>
    </div>
    <div data-flex="v" data-gap data-richtext>
      <h3>How to install (iPhone/iPad):</h3>
      <p>
        In your browser, tap <strong><Icon inline icon="ios_share" /> Share</strong>,
        scroll down, tap <strong>Add to Home Screen.</strong> Open the app from your Home
        Screen to get started.
      </p>
      <p>
        On another device? No problem! <a
          href="#other"
          on:click={() => {
            $App.sheet_id = 'app_help';
          }}>Read instructions.</a
        >
      </p>
    </div>
    <div data-flex="v" data-gap>
      <h3 class="half">Get help:</h3>
      <Help summary="I can't find the button!">
        <p>
          If you opened the link from TikTok or Insta, you'll need to visit our
          website in your actual browser. <a
            href="https://pocketrides.com"
            rel="noreferrer">Tap and hold this link.</a
          >
        </p>
      </Help>
      <Help summary="Why can't I download it yet?">
        <p>
          Because we pay you a penny per like, app stores would like to take a cut of
          that transaction, as well as a cut of the subscription price. We think
          that's unfair, <a
            href="https://www.theverge.com/2023/7/17/23798090/apple-epic-supreme-court-app-store-appeal"
            target="_blank"
            rel="noreferrer">but we're watching the situation closely</a
          >. Give us time — we'll figure this out.
        </p>
      </Help>
    </div>
  </div>
</Sheet>

<style lang="scss">
  [data-icon] {
    overflow: hidden;
    border-radius: 0.666rem;
  }
</style>
