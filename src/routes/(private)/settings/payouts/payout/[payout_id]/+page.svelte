<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Main from '$lib/components/Main.svelte';
  import Row from '$lib/components/Row.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import { formatCents } from '$lib/util/currency';
  import { plural } from '$lib/util/plural';
  import { formatDate } from '$lib/util/time-ago';
  import { humanStatus } from '$lib/zod/Payout';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<SiteHeader utility>
  <div slot="left">
    <Button icon="arrow_back_ios" label="Payouts" href="/settings/payouts" />
  </div>
  <div slot="right" />
</SiteHeader>
<Main>
  <div data-flex="v" data-gap="1">
    <div data-ph>
      <Row>
        <div slot="left">
          <h1>
            <Icon icon="attach_money" />
            {formatCents(data.payout.count)}
          </h1>
        </div>
        <div slot="right">
          {#if false}
            <Button
              id="new_payout"
              icon="attach_money"
              href="/settings/payouts/payout"
              label="New payout"
            />
          {/if}
        </div>
      </Row>
    </div>
    <Container fill="system-superlight" rounded padded={false} bordered>
      <div data-flex="v" data-unstyle>
        <div data-flex="v" data-fill="superlight" data-padded>
          <div class="h1 jumbo thin">$1.32</div>
          <div class="h2">
            <Icon icon="today" />
            {formatDate(new Date(data.payout.ts / 1000))}
          </div>
          <div class="h2">
            <Icon icon="check" />
            Status: {humanStatus(data.payout.status)}
          </div>
        </div>
        <div data-flex="vs" data-gap data-padded>
          <div class="h3">
            <Icon icon="favorite_border" />
            {plural(data.payout.count, 'like', 'likes', true)}
          </div>
          <div class="h3">
            <Icon icon="support" />
            0 quarantines
          </div>
          <div class="h3">
            <Icon icon="visibility" />
            600 views
          </div>
          <div class="h3">
            <Icon icon="add_moderator" />
            No problems!
          </div>
        </div>
      </div>
    </Container>
  </div>
</Main>
