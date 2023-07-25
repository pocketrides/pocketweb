<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import NametagWithPic from '$lib/components/NametagWithPic.svelte';
  import { App } from '$lib/stores/app';
  import { plural } from '$lib/util/plural';
  import { formatWorldfeedLocation, getWorldfeedLink } from '$lib/util/worldfeed';
  import type { ServerPocket } from '$lib/zod/Pocket';
  import type { ClientPocketMember } from '$lib/zod/PocketMember';
  import type { Writable } from 'svelte/store';

  export let pocket: Writable<ServerPocket>;
  // export let my_membership: Writable<ClientPocketMember | undefined>;
  export let privacy_mode: boolean = false;

  // @ts-ignore
  $: has_browser_share = browser && typeof navigator?.share === 'function';
</script>

<Container padded={false}>
  <div data-flex="v" data-padded="h" data-gap>
    <p class="half small thin">
      <Icon icon="campaign" inline />
      Hosted by:
    </p>
    <div data-flex="scroll-h" data-gap>
      <NametagWithPic nametag={$pocket.nametag} />
      {#each $pocket.hosts as host (host)}
        <NametagWithPic nametag={host} />
      {/each}
    </div>
    <div data-flex data-gap>
      {#if privacy_mode === false}
        <a
          href="#followers"
          class="half small strong"
          data-unstyle
          on:click|preventDefault={() => {
            $App.sheet_id = 'pocket_members';
          }}
        >
          <Icon icon="emoji_people" inline />
          {#if $pocket.settings.joinability === 'broadcast'}
            <u>{plural($pocket.members_count, 'follower', 'followers', true)}</u>
          {:else}
            <u>{plural($pocket.members_count, 'member', 'members', true)}</u>
          {/if}
        </a>
        <!-- {#if $my_membership?.status === 'admin'}
          <a
            href="#followers"
            class="small strong"
            on:click|preventDefault={() => {
              $App.sheet_id = 'pocket_members';
            }}
          >
            Manage
          </a>
        {/if} -->
        <!-- {#if $my_membership && has_browser_share}
          <a
            href="#share"
            class="small strong"
            data-unstyle
            on:click|preventDefault={() => {
              try {
                navigator.share({
                  url: `https://${window.location.host}/pocket/${$pocket.id}`
                });
              } catch (e) {
                return;
              }
            }}
          >
            <Icon icon="ios_share" inline />
            Invite
          </a>
        {/if} -->
      {/if}
      {#if $pocket.settings.worldfeed}
        <a
          href={getWorldfeedLink($pocket.settings.worldfeed)}
          class="half small strong"
          data-unstyle
        >
          <Icon icon="public" inline />
          <u>{formatWorldfeedLocation($pocket.settings.worldfeed)}</u>
        </a>
      {/if}
    </div>
  </div>
</Container>

<style lang="scss">
  [data-flex='scroll-h'] {
    scroll-padding: 0 1rem;

    :global(> *) {
      scroll-snap-align: start;
    }
  }
</style>
