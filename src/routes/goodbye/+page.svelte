<script lang="ts">
  import Container from '$lib/components/Container.svelte';
  import Logo from '$lib/components/Logo.svelte';
  import Main from '$lib/components/Main.svelte';
  import type { PageData } from './$types';

  let data: PageData;
</script>

<svelte:head>
  <title>Goodbye &lt;3</title>
</svelte:head>

<Main>
  <Container>
    <div data-flex="v" data-gap>
      <h1 data-flex data-gap><Logo /> Goodbye 🫶</h1>
      <h2>Thanks for everything!</h2>
      <p>
        For everyone who signed up for Pocketrides: thank you. It's been an honor to
        build a better, safer, fairer social network with you.
      </p>
      <p>
        <strong>Paid customers:</strong> expect to receive a small refund by Sept. 10,
        2023.
      </p>
      <p class="strong">
        Questions: <a href="mailto:hello@pocketrides.cc">hello@pocketrides.cc</a>
      </p>
    </div>
  </Container>
</Main>

<style lang="scss">
  div {
    padding-top: env(safe-area-inset-top);
  }
</style>
