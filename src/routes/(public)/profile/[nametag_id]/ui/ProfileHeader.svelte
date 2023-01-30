<script lang="ts">
  import type { PageData } from '../$types';
  import Nametag from '$lib/components/Nametag.svelte';
  import { plural } from '$lib/util/plural';
  import { page } from '$app/stores';
  import ProfilePic from './ProfilePic.svelte';
  import ProfilePicUpload from './ProfilePicUpload.svelte';

  export let data: PageData;
</script>

<div class="header" data-flex data-gap="1">
  {#if $page.data.my_nametag?.id === $page.data.page_nametag.id}
    <ProfilePicUpload profile_pic={$page.data.page_nametag_stats.profile_pic} />
  {:else}
    <ProfilePic profile_pic={$page.data.page_nametag_stats.profile_pic} />
  {/if}
  <div data-flex="v sb">
    <Nametag nametag={data.page_nametag} style="jumbo" />
    <ul data-flex="v" data-unstyle>
      <li>
        <p class="h3">
          {plural(data.page_nametag_stats.friends, 'friend', 'friends')}
        </p>
      </li>
      <li>
        <p class="h3">
          {plural(data.page_nametag_stats.followers, 'follower', 'followers')}
        </p>
      </li>
      <li>
        <p class="h3">{plural(data.page_nametag_stats.posts, 'post', 'posts')}</p>
      </li>
    </ul>
  </div>
</div>

<style lang="scss">
  .header {
    margin-top: 2rem;
  }
</style>
