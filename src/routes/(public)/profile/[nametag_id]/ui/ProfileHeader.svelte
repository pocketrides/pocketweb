<script lang="ts">
  import type { PageData } from '../$types';
  import Nametag from '$lib/components/Nametag.svelte';
  import { plural } from '$lib/util/plural';
  import { page } from '$app/stores';
  import ProfilePic from './ProfilePic.svelte';
  import ProfilePicUpload from './ProfilePicUpload.svelte';
  import { writable, type Writable } from 'svelte/store';
  import Icon from '$lib/components/Icon.svelte';
  import Button from '$lib/components/Button.svelte';
  import { browser } from '$app/environment';
  import { App } from '$lib/stores/app';

  export let page_controller: Writable<PageData>;

  const share_controller = writable('');
</script>

<div data-flex="v" data-gap>
  <div class="header" data-flex="g" data-gap="1">
    {#if $page_controller.is_my_profile_page}
      <ProfilePicUpload profile_pic={$page.data.my_nametag?.profile_pic} />
    {:else}
      <ProfilePic profile_pic={$page_controller.page_nametag.profile_pic} />
    {/if}
    <div data-flex="v sb as g" data-gap>
      <Nametag nametag={$page_controller.page_nametag} large />
      <div class="share-wrapper" data-flex="sb">
        <ul data-flex="v" data-unstyle>
          {#if $page_controller.relationship.is_close_friend}
            <li class="h3" data-color="base">
              <Icon icon="favorite" />Close Friends
            </li>
          {/if}
          <li>
            <!-- svelte-ignore a11y-invalid-attribute -->
            <a
              class="h3"
              data-unstyle
              href="#"
              aria-label="Tap to open friends list"
              on:click|preventDefault={() => {
                $App.sheet_id = 'profile_friends_list';
              }}
            >
              {plural(
                $page_controller.page_nametag_stats.friends,
                'friend',
                'friends'
              )}
            </a>
          </li>
          <li>
            <!-- svelte-ignore a11y-invalid-attribute -->
            <a
              class="h3"
              data-unstyle
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
            <p class="h3">
              {plural($page_controller.page_nametag_stats.posts, 'post', 'posts')}
            </p>
          </li>
        </ul>
        {#if browser && typeof navigator?.share === 'function'}
          <div class="share" data-flex="ae">
            <Button
              id="share"
              label="Share"
              icon="ios_share"
              small
              controller={share_controller}
              on:click={() => {
                navigator.share({
                  url: window.location.toString()
                });
                $share_controller = '';
              }}
            />
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .header {
    margin-top: 2rem;
  }

  .share-wrapper {
    width: 100%;
  }

  .share {
    position: relative;
    margin-left: auto;

    :global(button) {
      position: absolute;
      right: 0;
    }
  }
</style>
