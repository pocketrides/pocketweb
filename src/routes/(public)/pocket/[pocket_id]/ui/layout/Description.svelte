<script lang="ts">
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import type { ServerPocket } from '$lib/zod/Pocket';
  import type { Writable } from 'svelte/store';

  export let pocket: Writable<ServerPocket>;
</script>

<Container>
  <h2>
    <Icon icon="description" multiline />
    {@html $pocket.details.desc_html}
  </h2>
</Container>
