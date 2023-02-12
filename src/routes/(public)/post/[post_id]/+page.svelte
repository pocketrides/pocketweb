<script lang="ts">
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<SiteHeader />
<Main>
  {@html data.post.contents[0].content}
</Main>
