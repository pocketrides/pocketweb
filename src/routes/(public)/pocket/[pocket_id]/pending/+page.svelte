<script lang="ts">
  import Main from '$lib/components/Main.svelte';
  import { writable } from 'svelte/store';
  import PocketUtilityNav from '../ui/PocketActions.svelte';
  import type { PageData } from './$types';
  import type { ClientPocketMember } from '$lib/zod/PocketMember';
  import { App } from '$lib/stores/app';

  export let data: PageData;

  const pocket = writable(data.pocket);
  const my_membership = writable<ClientPocketMember | undefined>(data.my_membership);

  $: $pocket = data.pocket;
  $: $my_membership = data.my_membership;

  $App.theme = $pocket.theme;
  // $App.fill = 'dark';
</script>

<Main fullheight>
  <PocketUtilityNav {pocket} {my_membership} slot="utility-nav" />
</Main>
