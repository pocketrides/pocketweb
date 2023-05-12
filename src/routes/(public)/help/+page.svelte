<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
</script>

<svelte:head>
  <title>Contact Pocketrides</title>
  <meta property="og:title" content="Need help?" />
  <meta property="og:description" content="We're all ears!" />
  <meta name="description" content="We're all ears!" />
</svelte:head>

<SiteHeader huddable />
<Main fullheight>
  <div data-flex="v" data-gap="1">
    <h1 data-ph>
      <Icon icon="mark_email_unread" />
      Contact Pocketrides
    </h1>
    <Container rounded fill="system-superlight">
      <div data-flex="v as" data-gap>
        <h2>Need help? Have a question or feature suggestion?</h2>
        <p>We're all ears. Shoot us an email and we'll get right back to you.</p>
        <div data-flex data-gap>
          <Button
            label="Email us"
            href="mailto:hello@pocketrides.cc?subject=Hello!"
          />
          <Button label="Suggest a feature" href="/pocket/362021519145041997" />
        </div>
      </div>
    </Container>
  </div>
</Main>
