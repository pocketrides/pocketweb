<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
</script>

<SiteHeader>
  <div slot="left">
    <h1 class="h2">
      <Icon icon="attach_money" />
      Payout deets
    </h1>
  </div>
  <div slot="right">
    <Button label="Back" href="/settings/payouts" />
  </div>
</SiteHeader>
<Main>
  <Container fill="system-superlight" rounded padded={false} bordered>
    <div data-flex="v" data-unstyle>
      <div data-flex="v" data-fill="superlight" data-padded>
        <div class="h1 jumbo thin">$1.32</div>
        <div class="h2">
          <Icon icon="today" />
          February 10th, 2023
        </div>
        <div class="h2">
          <Icon icon="check" />
          Status: Paid
        </div>
      </div>
      <div data-flex="vs" data-gap data-padded>
        <div class="h3">
          <Icon icon="favorite_border" />
          132 likes
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
</Main>
