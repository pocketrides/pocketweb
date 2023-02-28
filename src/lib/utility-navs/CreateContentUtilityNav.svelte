<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import ButtonRow from '$lib/components/ButtonRow.svelte';
  import UtilityNav from '$lib/components/UtilityNav.svelte';
  import { writable } from 'svelte/store';

  const button_row = writable('new_post');
</script>

<UtilityNav>
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
      <!-- <Button
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
      /> -->
    </ButtonRow>
  </div>
</UtilityNav>
