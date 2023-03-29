<script lang="ts">
  import { page } from '$app/stores';
  import Sheet from '$lib/components/Sheet.svelte';
  import FollowersList from '$lib/forms/nametag/FollowersList.svelte';
</script>

<Sheet id="profile_followers_list" header="Followers">
  <div data-gap>
    <FollowersList followers_for={$page.data.page_nametag.id} />
  </div>
</Sheet>
