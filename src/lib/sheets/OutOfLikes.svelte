<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import { App } from '$lib/stores/app';
</script>

<Sheet id="out_of_likes" header="Out of likes!" icon="favorite">
  <div data-flex="v as" data-gap>
    <h2>You're out of likes! <span class="half">That's awesome!</span></h2>
    <p>
      Thanks for supporting creativity on Pocketrides. You'll get 250 likes next time
      your subscription renews.
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
