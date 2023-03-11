<script lang="ts">
  import { formatCents } from '$lib/util/currency';
  import { formatDate } from '$lib/util/time-ago';
  import type { Fill } from '$lib/zod/Fill';
  import { humanStatus, type ServerPayout } from '$lib/zod/Payout';

  export let payout: ServerPayout;

  const getFillForStatus = (): Fill => {
    switch (payout.status) {
      case 'processing_error':
        return 'base';
    }

    return 'system-superlight';
  };
</script>

<a
  href={payout.status === 'transferred'
    ? `/settings/payouts/payout/${payout.id}`
    : `/settings/payouts/payout`}
  data-3d="ah"
  data-unstyle
  data-fill={getFillForStatus()}
  data-flex="v"
  data-gap="0"
>
  <p class="h1 jumbo thin">
    {formatCents(payout.count)}{payout.is_exact ? '' : '+'}
  </p>
  <p>
    <strong>{humanStatus(payout.status)}</strong> • {formatDate(
      new Date(payout.ts / 1000)
    )}
  </p>
</a>

<style lang="scss">
  a {
    padding: 1rem;

    @media (min-width: 640px) {
      width: calc(50% - 0.5rem);
    }
  }
</style>
