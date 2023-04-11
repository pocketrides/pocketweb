<script lang="ts">
  import NametagWithPic from '$lib/components/NametagWithPic.svelte';
  import Row from '$lib/components/Row.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import MembersList from '$lib/forms/pockets/MembersList.svelte';
  import type { ServerPocket } from '$lib/zod/Pocket';
  import type { ClientPocketMember } from '$lib/zod/PocketMember';
  import type { Writable } from 'svelte/store';
  import AdminMemberListItem from './members/AdminMemberListItem.svelte';
  import { plural } from '$lib/util/plural';
  import { invalidateAll } from '$app/navigation';

  export let pocket: Writable<ServerPocket>;
  export let my_membership: Writable<ClientPocketMember | undefined>;

  $: header =
    $pocket.settings.joinability === 'broadcast'
      ? plural($pocket.members_count, 'Follower', 'Followers', true)
      : plural($pocket.members_count, 'Member', 'Members', true);
</script>

<Sheet
  id="pocket_members"
  icon="hail"
  {header}
  padded={false}
  on:dismiss={async () => {
    if ($my_membership?.status === 'admin') await invalidateAll();
  }}
>
  {#if $my_membership && $my_membership.status === 'admin'}
    <MembersList
      pocket_id={$pocket.id}
      let:member
      let:reload
      joined_only={false}
      on:count={(e) => {
        $pocket.members_count = e.detail;
      }}
    >
      <AdminMemberListItem {member} on:reload={reload} />
    </MembersList>
  {:else}
    <MembersList pocket_id={$pocket.id} let:member>
      <li data-padded>
        <Row>
          <div slot="left">
            <NametagWithPic nametag={member.nametag} large />
          </div>
        </Row>
      </li>
    </MembersList>
  {/if}
</Sheet>
