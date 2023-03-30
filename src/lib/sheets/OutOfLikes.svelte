<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import { App } from '$lib/stores/app';
</script>

<Sheet id="out_of_likes" header="Out of likes!" icon="favorite">
  <div data-flex="v as" data-gap>
    <h2>You're out of likes! <span class="half">That's awesome!</span></h2>
    <p>
      <strong>You gave $2.50 to your friends this month - wow.</strong> We hope you're
      liking Pocketrides so far. Taking care of each other in small ways is the way forward.
    </p>
    <p>
      You'll get 250 likes next time your subscription renews. Don't want to wait? <a
        href="mailto:hello@pocketrides.cc?subject=Let me buy more likes!"
        class="h3">Let me buy more likes!</a
      >
    </p>
  </div>
  <div data-flex="cc">
    <Button
      label="Done"
      xlarge
      primary
      on:click={() => {
        $App.sheet_id = '';
      }}
    />
  </div>
</Sheet>

<style lang="scss">
  [data-flex='cc'] {
    margin-top: 3rem;
  }
</style>
