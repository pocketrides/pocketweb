<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import { PocketMemberLeaveRequest } from '$lib/api/pocket/members/leave';
  import { NewPocketMemberRequest } from '$lib/api/pocket/members/new';
  import Button from '$lib/components/Button.svelte';
  import ButtonRow from '$lib/components/ButtonRow.svelte';
  import Container from '$lib/components/Container.svelte';
  import UtilityNav from '$lib/components/UtilityNav.svelte';
  import { App } from '$lib/stores/app';
  import { is_standalone } from '$lib/util/is-standalone';
  import type { ServerPocket } from '$lib/zod/Pocket';
  import type { ClientPocketMember } from '$lib/zod/PocketMember';
  import { writable, type Writable } from 'svelte/store';

  export let pocket: Writable<ServerPocket>;
  export let my_membership: Writable<ClientPocketMember | undefined>;

  const controller = writable('new_post');
  const joining = writable(false);
  const leaving = writable(false);
  const checking = writable(false);
  const toggling_notifs = writable(false);

  const joinClick = async () => {
    if ($page.data.my_nametag) {
      $joining = true;
      const res = await NewPocketMemberRequest.post($pocket.id);
      if (res.success === false && res.reason === 'max_free') {
        $joining = false;

        if ($page.data.my_nametag?.stripe?.has_sub !== true) {
          $App.sheet_id = 'joined_max_free_pockets';
        }

        return;
      }
      await invalidateAll();
      $joining = false;

      if (!is_standalone) {
        if ($pocket.settings.joinability === 'moderated') {
          $App.sheet_id = 'app_help';
        } else {
          $App.sheet_id = 'app_help_joined';
        }
      }
    } else {
      $App.sheet_id = 'onboarding';
    }
  };

  const leaveClick = async () => {
    if ($page.data.my_nametag) {
      $leaving = true;
      await PocketMemberLeaveRequest.post($pocket.id);
      await invalidateAll();
      $leaving = false;
    } else {
      $App.sheet_id = 'onboarding';
    }
  };

  const checkClick = async () => {
    $checking = true;
    await invalidateAll();
    $checking = false;
  };
</script>

<Container padded={false}>
  <div data-padded="h">
    {#if $my_membership}
      {#if $my_membership.status === 'admin'}
        <ButtonRow>
          <Button
            id="new_post"
            label="New post"
            icon="signpost"
            {controller}
            href={`/post?pocket=${$pocket.id}`}
          />
          <Button
            label="Edit"
            icon="edit"
            href={`/pocket?edit=${$pocket.id}`}
            {controller}
          />
          <Button
            id="share"
            label="Share"
            icon="ios_share"
            {controller}
            on:click={() => {
              try {
                navigator.share({
                  url: window.location.toString()
                });
                controller.update(() => '');
              } catch (e) {
                return;
              }
            }}
          />

          <!-- <Button
        icon="keyboard_arrow_up"
        label="Top"
        {controller}
        on:click={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          controller.update(() => '');
        }}
      />
      <Button
        icon="keyboard_arrow_down"
        label="Bottom"
        {controller}
        on:click={() => {
          const main = document.querySelector('main');
          if (!main) return;
          window.scrollTo({
            top:
              (main.offsetTop + main.clientHeight || Infinity) -
              window.innerHeight -
              16,
            behavior: 'smooth'
          });

          controller.update(() => '');
        }}
      /> -->
        </ButtonRow>
      {:else if $my_membership.status === 'pending'}
        <div data-flex="v as" data-gap>
          <div>
            <p class="h2 half">Request sent</p>
            <p>
              Waiting for the {$pocket.hosts.length ? `hosts` : 'host'} to approve you.
            </p>
            <p>
              {#if !is_standalone}<a
                  href="#app"
                  on:click|preventDefault={() => {
                    $App.sheet_id = 'app_help';
                  }}
                  class="strong">Want the app</a
                >?{/if}
            </p>
          </div>
          <ButtonRow let:controller initial="refresh">
            <Button
              id="refresh"
              label={$checking ? 'One sec!' : 'Check status'}
              disabled={$checking}
              icon_spins={$checking}
              icon={$checking ? 'autorenew' : 'refresh'}
              {controller}
              on:click={checkClick}
            />

            <Button
              label={$leaving ? 'One sec!' : 'Cancel request'}
              disabled={$leaving}
              icon="cancel"
              {controller}
              on:click={leaveClick}
            />
          </ButtonRow>
        </div>
      {:else if $my_membership.status === 'joined'}
        {#if $pocket.settings.joinability === 'broadcast'}
          <ButtonRow>
            <Button
              label={$leaving ? 'One sec!' : 'Unfollow'}
              icon="group_remove"
              disabled={$leaving}
              {controller}
              on:click={leaveClick}
            />
            <Button
              id="share"
              label="Share"
              icon="ios_share"
              {controller}
              on:click={() => {
                try {
                  navigator.share({
                    url: window.location.toString()
                  });
                  controller.update(() => '');
                } catch (e) {
                  return;
                }
              }}
            />

            <!-- <Button
              icon="keyboard_arrow_up"
              label="Top"
              {controller}
              on:click={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                controller.update(() => '');
              }}
            />
            <Button
              icon="keyboard_arrow_down"
              label="Bottom"
              {controller}
              on:click={() => {
                const main = document.querySelector('main');
                if (!main) return;
                window.scrollTo({
                  top:
                    (main.offsetTop + main.clientHeight || Infinity) -
                    window.innerHeight -
                    16,
                  behavior: 'smooth'
                });

                controller.update(() => '');
              }}
            /> -->
          </ButtonRow>
        {:else}
          <ButtonRow>
            <Button
              id="new_post"
              label="New post"
              icon="signpost"
              {controller}
              href={`/post?pocket=${$pocket.id}`}
            />
            <Button
              id="leave"
              label={$leaving ? 'One sec!' : 'Leave'}
              disabled={$leaving}
              icon="group_remove"
              {controller}
              on:click={leaveClick}
            />
            <Button
              id="share"
              label="Share"
              icon="ios_share"
              {controller}
              on:click={() => {
                try {
                  navigator.share({
                    url: window.location.toString()
                  });
                  controller.update(() => '');
                } catch (e) {
                  return;
                }
              }}
            />

            <!-- <Button
          icon="keyboard_arrow_up"
          label="Top"
          {controller}
          on:click={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            controller.update(() => '');
          }}
        />
        <Button
          icon="keyboard_arrow_down"
          label="Bottom"
          {controller}
          on:click={() => {
            const main = document.querySelector('main');
            if (!main) return;
            window.scrollTo({
              top:
                (main.offsetTop + main.clientHeight || Infinity) -
                window.innerHeight -
                16,
              behavior: 'smooth'
            });

            controller.update(() => '');
          }}
        /> -->
          </ButtonRow>
        {/if}
      {/if}
    {:else if $pocket.settings.joinability === 'anyone'}
      <ButtonRow let:controller initial="join">
        {#if $page.data.my_nametag}
          <Button
            id="join"
            label={$joining ? 'One sec!' : 'Join Pocket'}
            disabled={$joining}
            icon="hail"
            {controller}
            on:click={joinClick}
          />
        {:else}
          <Button
            id="join"
            label="Get free account"
            icon="hail"
            {controller}
            on:click={joinClick}
          />
        {/if}
        <Button
          id="what"
          {controller}
          label="What is this?"
          icon="help"
          href="/?help=1"
        />
        <Button
          id="share"
          label="Share"
          icon="ios_share"
          {controller}
          on:click={() => {
            try {
              navigator.share({
                url: window.location.toString()
              });
              controller.update(() => '');
            } catch (e) {
              return;
            }
          }}
        />
      </ButtonRow>
    {:else if $pocket.settings.joinability === 'moderated'}
      <ButtonRow let:controller initial="join">
        <Button
          id="join"
          label={$joining ? 'One sec!' : 'Request to join'}
          disabled={$joining}
          icon="hail"
          {controller}
          on:click={joinClick}
        />
        <Button
          id="what"
          {controller}
          label="What is this?"
          icon="help"
          href="/?help=1"
        />
        <Button
          id="share"
          label="Share"
          icon="ios_share"
          {controller}
          on:click={() => {
            try {
              navigator.share({
                url: window.location.toString()
              });
              controller.update(() => '');
            } catch (e) {
              return;
            }
          }}
        />
      </ButtonRow>
    {:else if $pocket.settings.joinability === 'broadcast'}
      <ButtonRow let:controller initial="join">
        <Button
          id="join"
          label={$joining ? 'One sec!' : 'Follow'}
          disabled={$joining}
          icon="hail"
          {controller}
          on:click={joinClick}
        />
        <Button
          id="what"
          {controller}
          label="What is this?"
          icon="help"
          href="/?help=1"
        />
        <Button
          id="share"
          label="Share"
          icon="ios_share"
          {controller}
          on:click={() => {
            try {
              navigator.share({
                url: window.location.toString()
              });
              controller.update(() => '');
            } catch (e) {
              return;
            }
          }}
        />
      </ButtonRow>
    {/if}
  </div>
</Container>
