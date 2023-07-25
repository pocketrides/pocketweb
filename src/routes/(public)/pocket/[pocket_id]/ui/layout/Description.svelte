<script lang="ts">
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import type { ServerPocket } from '$lib/zod/Pocket';
  import type { Writable } from 'svelte/store';

  export let pocket: Writable<ServerPocket>;
</script>

<Container>
  <p class="strong half small">
    <Icon icon="description" />
    Description
  </p>
  <div data-richtext>
    {@html $pocket.details.desc_html}
  </div>
</Container>
