<script lang="ts">
  import { page } from '$app/stores';
  import Sheet from '$lib/components/Sheet.svelte';
  import FriendsList from '$lib/forms/nametag/FriendsList.svelte';
</script>

<Sheet id="profile_friends_list" header="Friends">
  <div data-gap>
    <FriendsList friends_for={$page.data.page_nametag.id} />
  </div>
</Sheet>
