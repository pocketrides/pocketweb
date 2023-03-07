<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
</script>

<SiteHeader />
<Main>
  <div data-flex="v" data-gap="1">
    <h1>Get help</h1>
    <Container rounded padded bordered fill="superlight">
      <div data-flex="v as" data-gap>
        <p>Need help? Have a question, or feature suggestion? We're here to help.</p>
        <Button label="Email us" href="mailto:hello@pocketrides.cc?subject=Hello!" />
      </div>
    </Container>
    <!-- <div data-flex="v" data-gap>
      <h2 class="h3 half">Most popular</h2>
      <div data-flex="vs" data-gap>
        <Button label="Cancel subscription" jumbo />
      </div>
    </div> -->
  </div>
</Main>
