<script lang="ts">
  import Main from '$lib/components/Main.svelte';
  import Post from '$lib/components/Post.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let page_title = data.post.contents[0].content_raw;
  if (page_title.length > 40) page_title = page_title.substring(0, 40) + '…';
</script>

<svelte:head>
  <title>{page_title} | pocketrides!</title>
</svelte:head>

<SiteHeader />
<Main fullheight padded={false}>
  <Post post_id={data.post.id} />
</Main>
