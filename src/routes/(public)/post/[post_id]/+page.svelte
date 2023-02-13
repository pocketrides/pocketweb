<script lang="ts">
  import Main from '$lib/components/Main.svelte';
  import Post from '$lib/components/Post.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<SiteHeader />
<Main padded={false}>
  <Post post={data.post} />
</Main>
