<script lang="ts">
  import { WorldfeedGeoLookupRequest } from '$lib/api/worldfeed/geo';
  import Button from '$lib/components/Button.svelte';
  import { writable } from 'svelte/store';

  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const adding = writable(false);

  const handleAddClick = () => {
    $adding = true;

    navigator.geolocation.getCurrentPosition(
      async (position: GeolocationPosition) => {
        $adding = true;

        const res = await WorldfeedGeoLookupRequest.post({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });

        $adding = false;

        if (res.success && res.location) {
          dispatch('location', res.location);
        }
      },
      () => {
        $adding = false;
      },
      { timeout: 5000 }
    );
  };
</script>

<Button
  label=""
  icon={$adding ? 'refresh' : 'near_me'}
  disabled={$adding}
  icon_spins={$adding}
  large
  on:click={handleAddClick}
/>
