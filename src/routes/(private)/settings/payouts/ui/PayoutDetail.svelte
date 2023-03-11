<script lang="ts">
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import { formatCents } from '$lib/util/currency';
  import { plural } from '$lib/util/plural';
  import { formatDate } from '$lib/util/time-ago';
  import { humanStatus, type ServerPayout } from '$lib/zod/Payout';

  export let payout: ServerPayout;
</script>

<Container fill="system-superlight" rounded padded={false} bordered>
  <div data-flex="v" data-unstyle>
    <div data-flex="v" data-fill="system-light" data-padded>
      <div class="h1 jumbo thin">
        {formatCents(payout.count)}{payout.is_exact ? '' : '+'}
      </div>
      <div class="h2 half thin">
        <Icon icon="today" />
        {formatDate(new Date(payout.ts / 1000))}
      </div>
      {#if payout.status === 'idle'}
        <div class="h2 half thin">
          <Icon icon="check_circle" />
          Status: {humanStatus(payout.status)}
        </div>
      {:else if payout.status === 'processing'}
        <div class="h2 half thin">
          <Icon icon="autorenew" spins />
          Status: {humanStatus(payout.status)}
        </div>
      {:else if payout.status === 'transfer_ready'}
        <div class="h2 half thin">
          <Icon icon="attach_money" />
          Status: {humanStatus(payout.status)}
        </div>
      {:else if payout.status === 'transferred'}
        <div class="h2 half thin">
          <Icon icon="done" />
          Status: {humanStatus(payout.status)}
        </div>
      {/if}
    </div>
    <div
      data-flex="vs"
      data-gap
      data-padded
      class:half={payout.status !== 'transferred'}
    >
      <div class="h3">
        {payout.status === 'transfer_ready'
          ? 'Processed:'
          : payout.status === 'transferred'
          ? 'Totals:'
          : 'Processing:'}
      </div>
      <div class="h3">
        <Icon icon="favorite_border" />
        {plural(payout.grand_total, 'like', 'likes', true)}
      </div>
      <div class="h3">
        <Icon icon="paid" />
        {formatCents(payout.grand_total)}
      </div>
    </div>
  </div>
</Container>
