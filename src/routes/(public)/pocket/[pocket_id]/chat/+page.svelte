<script lang="ts">
  import Main from '$lib/components/Main.svelte';
  import UtilityNav from '$lib/components/UtilityNav.svelte';
  import MessageComposer from '$lib/components/messaging/MessageComposer.svelte';
  import type { PageData } from './$types';

  // export let data: PageData;
</script>

<Main fullheight>
  <h2>Chat</h2>

  <UtilityNav padded={false} slot="utility-nav">
    <MessageComposer always_active />
  </UtilityNav>
</Main>
