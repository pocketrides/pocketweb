<script lang="ts">
  import { App } from '$lib/stores/app';
  import { writable } from 'svelte/store';
  import type { PageData } from './$types';
  import Main from '$lib/components/Main.svelte';
  import PocketUtilityNav from './ui/PocketUtilityNav.svelte';
  import type { ClientPocketMember } from '$lib/zod/PocketMember';

  export let data: PageData;

  const pocket = writable(data.pocket);
  const my_membership = writable<ClientPocketMember | undefined>(data.my_membership);

  $: $pocket = data.pocket;
  $: $my_membership = data.my_membership;

  $App.theme = $pocket.theme;
  $App.fill = 'dark';
</script>

<Main fullheight>
  <h2>Posts</h2>
  <PocketUtilityNav slot="utility-nav" {pocket} {my_membership} />
</Main>
