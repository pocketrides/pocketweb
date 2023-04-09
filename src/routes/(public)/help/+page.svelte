<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
</script>

<SiteHeader />
<Main fullheight>
  <div data-flex="v" data-gap="1">
    <h1>Contact Pocketrides</h1>
    <Container rounded bordered fill="superlight">
      <div data-flex="v as" data-gap>
        <p class="h3">Need help? Have a question or feature suggestion?</p>
        <p>We're all ears. Shoot us an email and we'll get right back to you.</p>
        <Button label="Email us" href="mailto:hello@pocketrides.cc?subject=Hello!" />
      </div>
    </Container>
  </div>
</Main>
