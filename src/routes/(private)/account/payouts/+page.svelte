<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import ButtonRow from '$lib/components/ButtonRow.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Main from '$lib/components/Main.svelte';
  import Row from '$lib/components/Row.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import HowPayoutsWork from './ui/HowPayoutsWork.svelte';
</script>

<SiteHeader utility>
  <div slot="left">
    <Button icon="arrow_back_ios" label="Settings" href="/account" />
  </div>
</SiteHeader>
<Main>
  <div data-flex="v" data-gap="1">
    <div data-ph>
      <Row>
        <div slot="left">
          <h1>
            <Icon icon="attach_money" />
            Payouts
          </h1>
        </div>
        <div slot="right">
          <ButtonRow initial="new_payout" let:controller>
            <Button
              id="stripe"
              icon="account_balance"
              label="Stripe dash"
              {controller}
            />
            <Button
              id="new_payout"
              icon="attach_money"
              href="/account/payouts/payout"
              label="New payout"
              {controller}
            />
          </ButtonRow>
        </div>
      </Row>
    </div>
    <div data-flex="v" data-gap>
      <h2 class="h3 half">Scheduled</h2>

      <div data-flex="vs" data-gap>
        <a
          href="/account/payouts/payout/123"
          data-3d="ah"
          data-unstyle
          data-fill="base"
          data-flex="v"
          data-gap="0"
        >
          <p class="h1 jumbo thin">$2.30</p>
          <p><strong>Scheduled</strong> • February 13th, 2023</p>
        </a>
      </div>
    </div>
    <div data-flex="v" data-gap>
      <h2 class="h3 half">Paid</h2>
      <div data-flex="vs" data-gap>
        <a
          href="/account/payouts/payout/123"
          data-3d="ah"
          data-unstyle
          data-fill="system-superlight"
          data-flex="v"
          data-gap="0"
        >
          <p class="h1 jumbo thin">$1.75</p>
          <p><strong>Paid</strong> • February 10th, 2023</p>
        </a>
        <a
          href="/account/payouts/payout/123"
          data-3d="ah"
          data-unstyle
          data-fill="system-superlight"
          data-flex="v"
          data-gap="0"
        >
          <p class="h1 jumbo thin">$2.00</p>
          <p><strong>Paid</strong> • February 6th, 2023</p>
        </a>
      </div>
    </div>
    <div data-flex="v" data-gap>
      <h2 class="h3 half">Denied</h2>
      <div data-flex="vs" data-gap>
        <a
          href="/account/payouts/payout/123"
          data-3d="ah"
          data-unstyle
          data-fill="dark"
          data-flex="v"
          data-gap
        >
          <p class="h1 thin half" data-flex data-gap>
            <span><Icon icon="favorite" /> 10</span>
            <span><Icon icon="support" /> 15</span>
            <span><Icon icon="visibility" /> 150</span>
          </p>
          <p>
            <strong data-color="base">Appealed</strong>
            <span class="half"> • February 8th, 2023</span>
          </p>
        </a>
      </div>
    </div>
    <HowPayoutsWork>
      <Button
        href="/account/payouts/payout?quickstart=1"
        label="Get started"
        xlarge
        primary
      />
      <Button href="/account" label="Go back" />
    </HowPayoutsWork>
  </div>
</Main>

<style lang="scss">
  a {
    padding: 1rem;

    @media (min-width: 640px) {
      width: calc(50% - 0.5rem);
    }
  }
</style>
