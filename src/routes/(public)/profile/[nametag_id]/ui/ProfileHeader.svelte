<script lang="ts">
  import type { PageData } from '../$types';
  import Nametag from '$lib/components/Nametag.svelte';
  import { plural } from '$lib/util/plural';
  import { page } from '$app/stores';
  import ProfilePic from './ProfilePic.svelte';
  import ProfilePicUpload from './ProfilePicUpload.svelte';
  import type { Writable } from 'svelte/store';
  import Icon from '$lib/components/Icon.svelte';
  import Container from '$lib/components/Container.svelte';
  import Button from '$lib/components/Button.svelte';
  import { StripeCreateAccountRequest } from '$lib/api/stripe/create_account';
  import { goto } from '$app/navigation';

  export let page_controller: Writable<PageData>;

  const startEnrollmentClick = async () => {
    const create_account = await StripeCreateAccountRequest.post();
    if (create_account.success) {
      await goto('/_/stripe/account/onboard');
    }
  };
</script>

<div data-flex="v" data-gap>
  {#if $page_controller.charges_enabled !== true}
    <div class="header">
      <Container rounded padded bordered fill="superlight">
        <h2>Heads up!</h2>
        <p>
          Complete your Stripe Account enrollment to start getting paid. It only
          takes about one minute. <Button
            href="/account/"
            label="Start now"
            on:click={startEnrollmentClick}
          />
        </p>
      </Container>
    </div>
  {/if}
  <div class="header" data-flex data-gap="1">
    {#if $page_controller.is_my_profile_page}
      <ProfilePicUpload profile_pic={$page.data.page_nametag_stats.profile_pic} />
    {:else}
      <ProfilePic profile_pic={$page.data.page_nametag_stats.profile_pic} />
    {/if}
    <div data-flex="v sb as" data-gap>
      <Nametag nametag={$page_controller.page_nametag} large />
      <ul data-flex="v" data-unstyle>
        {#if $page_controller.relationship.is_close_friend}
          <li class="h3" data-color="base">
            <Icon icon="favorite_outline" />Close Friends
          </li>
        {/if}
        <li>
          <p class="h3">
            {plural(
              $page_controller.page_nametag_stats.friends,
              'friend',
              'friends'
            )}
          </p>
        </li>
        <li>
          <p class="h3">
            {plural(
              $page_controller.page_nametag_stats.followers,
              'follower',
              'followers'
            )}
          </p>
        </li>
        <li>
          <p class="h3">
            {plural($page_controller.page_nametag_stats.posts, 'post', 'posts')}
          </p>
        </li>
      </ul>
    </div>
  </div>
</div>

<style lang="scss">
  .header {
    margin-top: 2rem;
  }
</style>
