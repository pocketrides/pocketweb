<script lang="ts">
  import { goto } from '$app/navigation';
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import NametagWithPic from '$lib/components/NametagWithPic.svelte';
  import Row from '$lib/components/Row.svelte';
  import { App } from '$lib/stores/app';
  import { plural } from '$lib/util/plural';
  import type { ServerPocket } from '$lib/zod/Pocket';
  import type { Writable } from 'svelte/store';

  export let pocket: Writable<ServerPocket>;
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
        {#if $pocket.settings.visibility === 'unlisted'}
          <p class="half small">
            <Icon icon="visibility_off" />
            Unlisted
          </p>
        {/if}
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
        <a
          href="#followers"
          data-unstyle
          class="h2 half"
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
        <h2 class="half">
          <Icon icon="campaign" />
          Hosted by:
        </h2>
      </div>
      <div data-flex="scroll-h" data-gap data-padded="h">
        <NametagWithPic nametag={$pocket.nametag} large />
        {#each $pocket.hosts as host (host)}
          <NametagWithPic nametag={host} large />
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
    max-width: 80%;
  }

  [data-flex='scroll-h'] {
    scroll-padding: 0 1rem;

    :global(> *) {
      scroll-snap-align: start;
    }
  }
</style>
