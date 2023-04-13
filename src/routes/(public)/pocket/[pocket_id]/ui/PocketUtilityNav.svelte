<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import { PocketMemberLeaveRequest } from '$lib/api/pocket/members/leave';
  import { NewPocketMemberRequest } from '$lib/api/pocket/members/new';
  import Button from '$lib/components/Button.svelte';
  import ButtonRow from '$lib/components/ButtonRow.svelte';
  import UtilityNav from '$lib/components/UtilityNav.svelte';
  import { App } from '$lib/stores/app';
  import { plural } from '$lib/util/plural';
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

{#if $my_membership}
  {#if $my_membership.status === 'admin'}
    <UtilityNav>
      <ButtonRow slot="left">
        <Button
          id="new_post"
          label="New post"
          icon="signpost"
          {controller}
          primary
          href={`/post?pocket=${$pocket.id}`}
        />
      </ButtonRow>
      <ButtonRow slot="right">
        <Button
          label="Edit"
          icon="edit"
          href={`/pocket?edit=${$pocket.id}`}
          large
          {controller}
        />
      </ButtonRow>
    </UtilityNav>
  {:else if $my_membership.status === 'pending'}
    <UtilityNav>
      <div data-flex="v as" data-gap slot="left">
        <div>
          <p class="h3 half">Requested</p>
          <p>
            Waiting for the {$pocket.hosts.length ? `hosts` : 'host'} to approve you.
          </p>
        </div>
        <ButtonRow let:controller initial="refresh">
          <Button
            id="refresh"
            label={$checking ? 'One sec!' : 'Check now'}
            disabled={$checking}
            icon_spins={$checking}
            icon={$checking ? 'autorenew' : 'refresh'}
            primary
            {controller}
            on:click={checkClick}
          />

          <Button
            label={$leaving ? 'One sec!' : 'Cancel request'}
            disabled={$leaving}
            icon="cancel"
            {controller}
            large
            on:click={leaveClick}
          />
        </ButtonRow>
      </div>
    </UtilityNav>
  {:else if $my_membership.status === 'joined'}
    {#if $pocket.settings.joinability === 'broadcast'}
      <UtilityNav>
        <Button
          slot="left"
          label={$leaving ? 'One sec!' : 'Unfollow'}
          icon="group_remove"
          disabled={$leaving}
          large
          on:click={leaveClick}
        />
      </UtilityNav>
    {:else}
      <UtilityNav>
        <ButtonRow slot="left">
          <Button
            id="new_post"
            label="New post"
            icon="signpost"
            {controller}
            primary
            href={`/post?pocket=${$pocket.id}`}
          />
          <Button
            id="leave"
            label={$leaving ? 'One sec!' : 'Leave'}
            disabled={$leaving}
            icon="group_remove"
            {controller}
            large
            on:click={leaveClick}
          />
        </ButtonRow>
        <ButtonRow slot="right">
          <Button
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
                  16 -
                  // @ts-ignore
                  (navigator.standalone ? 32 : 0),
                behavior: 'smooth'
              });

              controller.update(() => '');
            }}
          />
        </ButtonRow>
      </UtilityNav>
    {/if}
  {/if}
{:else}
  <UtilityNav>
    <div slot="left">
      {#if $pocket.settings.joinability === 'anyone'}
        <div data-flex="v as" data-gap>
          {#if $page.data.my_nametag === undefined}
            <div>
              <p class="h3">
                You're on Pocketrides! <strong class="half">Hello!</strong>
              </p>
              <p>
                This is a self-contained social network for whatever your {plural(
                  $pocket.hosts.length + 1,
                  'friend has',
                  'friends have'
                )}
                planned. It's free to join with just your phone number.
              </p>
            </div>
          {/if}
          <Button
            label={$joining ? 'One sec!' : 'Join for free'}
            disabled={$joining}
            icon="hail"
            primary
            on:click={joinClick}
          />
        </div>
      {:else if $pocket.settings.joinability === 'moderated'}
        <Button
          label={$joining ? 'One sec!' : 'Request to join'}
          disabled={$joining}
          icon="hail"
          primary
          on:click={joinClick}
        />
      {:else if $pocket.settings.joinability === 'broadcast'}
        <Button
          label={$joining ? 'One sec!' : 'Follow'}
          disabled={$joining}
          icon="hail"
          primary
          on:click={joinClick}
        />
      {/if}
    </div>
  </UtilityNav>
{/if}
