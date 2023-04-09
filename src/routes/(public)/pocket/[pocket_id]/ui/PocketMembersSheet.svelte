<script lang="ts">
  import Sheet from '$lib/components/Sheet.svelte';
  import type { ServerPocket } from '$lib/zod/Pocket';
  import type { ClientPocketMember } from '$lib/zod/PocketMember';
  import type { Writable } from 'svelte/store';

  export let pocket: Writable<ServerPocket>;
  export let my_membership: Writable<ClientPocketMember | undefined>;
</script>

<Sheet id="pocket_members" header="people/followers">Hi!</Sheet>
