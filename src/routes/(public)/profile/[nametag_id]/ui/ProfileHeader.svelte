<script lang="ts">
  import type { LayoutData } from '../$types';
  import { plural } from '$lib/util/plural';
  import Icon from '$lib/components/Icon.svelte';
  import { App } from '$lib/stores/app';
  import type { Writable } from 'svelte/store';
  import Container from '$lib/components/Container.svelte';

  export let page_controller: Writable<LayoutData>;
</script>

<Container padded={false}>
  <ul data-flex="ab" data-unstyle data-gap class="half" data-padded="h">
    <li>
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a
        class="small strong"
        href="#"
        aria-label="Tap to open friends list"
        on:click|preventDefault={() => {
          $App.sheet_id = 'profile_friends_list';
        }}
      >
        {plural($page_controller.page_nametag_stats.friends, 'friend', 'friends')}
      </a>
    </li>
    <li>
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a
        class="small strong"
        href="#"
        aria-label="Tap to open followers list"
        on:click|preventDefault={() => {
          $App.sheet_id = 'profile_followers_list';
        }}
      >
        {plural(
          $page_controller.page_nametag_stats.followers,
          'follower',
          'followers'
        )}
      </a>
    </li>
    <li>
      <p class="small" data-unstyle>
        {plural($page_controller.page_nametag_stats.posts, 'post', 'posts')}
      </p>
    </li>
  </ul>
</Container>
