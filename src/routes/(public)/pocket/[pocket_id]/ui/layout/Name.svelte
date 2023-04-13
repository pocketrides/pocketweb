<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import NametagWithPic from '$lib/components/NametagWithPic.svelte';
  import { App } from '$lib/stores/app';
  import { plural } from '$lib/util/plural';
  import type { ServerPocket } from '$lib/zod/Pocket';
  import type { ClientPocketMember } from '$lib/zod/PocketMember';
  import type { Writable } from 'svelte/store';

  export let pocket: Writable<ServerPocket>;
  export let my_membership: Writable<ClientPocketMember | undefined>;
  export let privacy_mode: boolean = false;

  // @ts-ignore
  $: has_browser_share = browser && typeof navigator?.share === 'function';
</script>

<Container padded={false}>
  <div data-flex="v" data-gap data-padded="v">
    <div
      data-name
      data-flex="ae"
      data-padded="h"
      class:normal={$pocket.cover_art.length > 0}
    >
      <div>
        <div data-flex data-gap>
          {#if $pocket.settings.visibility === 'unlisted'}
            <a
              href="#unlisted"
              class="half small"
              aria-label="Tap to learn about unlisted pockets"
              data-unstyle
              on:click|preventDefault={() => {
                $App.sheet_id = 'unlisted_howto';
              }}
            >
              <Icon icon="visibility_off" />
              Unlisted
            </a>
          {/if}
          {#if $pocket.settings.joinability === 'broadcast'}
            <a
              href="#broadcast"
              class="half small"
              aria-label="Tap to learn about broadcast mode"
              data-unstyle
              on:click|preventDefault={() => {
                $App.sheet_id = 'broadcast_howto';
              }}
            >
              <Icon icon="edit_off" />
              Broadcast Mode
            </a>
          {/if}
          {#if $pocket.settings.joinability === 'moderated'}
            <a
              href="#moderated"
              class="half small"
              aria-label="Tap to learn about private mode"
              data-unstyle
              on:click|preventDefault={() => {
                $App.sheet_id = 'moderated_howto';
              }}
            >
              <Icon icon="shield_with_heart" />
              Private Mode
            </a>
          {/if}
        </div>
        <h1
          class="jumbo"
          on:mouseup={() => {
            goto(`/pocket/${$pocket.id}`, { invalidateAll: true });
          }}
        >
          {@html $pocket.name_html}
        </h1>
      </div>
    </div>
    <div data-flex="v" data-gap>
      <div data-padded="h" data-flex="v as">
        {#if privacy_mode === false}
          <div data-flex data-gap>
            <a
              href="#followers"
              data-unstyle
              class="h3 half"
              on:click|preventDefault={() => {
                $App.sheet_id = 'pocket_members';
              }}
            >
              <Icon icon="emoji_people" />
              {#if $pocket.settings.joinability === 'broadcast'}
                {plural($pocket.members_count, 'follower', 'followers', true)}
              {:else}
                {plural($pocket.members_count, 'person', 'people', true)} here
              {/if}
            </a>
            {#if $my_membership?.status === 'admin'}
              <a
                href="#followers"
                data-unstyle
                class="h3"
                on:click|preventDefault={() => {
                  $App.sheet_id = 'pocket_members';
                }}
              >
                Manage
              </a>
            {/if}
            {#if $my_membership && has_browser_share}
              <a
                href="#share"
                data-unstyle
                class="h3"
                on:click|preventDefault={() => {
                  // @ts-ignore
                  navigator.share({
                    url: `https://${window.location.host}/pocket/${$pocket.id}`
                  });
                }}
              >
                <Icon icon="ios_share" />
                Invite
              </a>
            {/if}
          </div>
        {/if}
        {#if privacy_mode}
          <h3 class="half">
            <Icon icon="visibility_off" />
            Private, request to join.
          </h3>
        {/if}
        <h3 class="half">
          <Icon icon="campaign" />
          Hosted by:
        </h3>
      </div>
      <div data-flex="scroll-h" data-gap data-padded="h">
        <NametagWithPic nametag={$pocket.nametag} />
        {#each $pocket.hosts as host (host)}
          <NametagWithPic nametag={host} />
        {/each}
      </div>
    </div>
  </div>
</Container>

<style lang="scss">
  [data-name] {
    &:not(.normal) {
      min-height: 148px;
    }

    > div {
      width: 100%;
    }
  }

  h1 {
    max-width: 90%;
  }

  [data-flex='scroll-h'] {
    scroll-padding: 0 1rem;

    :global(> *) {
      scroll-snap-align: start;
    }
  }
</style>
