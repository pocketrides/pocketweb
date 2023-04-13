<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/Button.svelte';
  import ButtonRow from '$lib/components/ButtonRow.svelte';
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<svelte:head>
  <title>nsfw warning | on pocketrides!</title>
  <meta property="og:title" content={`this post may be spicy | on pocketrides!`} />
</svelte:head>

<SiteHeader />
<Main fullheight>
  <Container>
    <div data-flex="v as" data-gap="1">
      <div>
        <h2>
          <Icon icon="info" />
          Heads up! <span class="half">This post is NSFW.</span>
        </h2>
        <p>By continuing, you acknowledge you're at least 18 years old.</p>
      </div>
      <ButtonRow let:controller initial="safety">
        <Button
          id="safety"
          icon="home"
          label="Go home"
          primary
          {controller}
          href="/"
        />
        <Button
          id="continue"
          icon="visibility"
          label="Continue"
          large
          href={`/post/${data.post_id}?ok=1`}
          {controller}
        />
      </ButtonRow>
      {#if $page.data.my_nametag}
        <div data-ph class="half small">
          Rather not be warned?
          <a href="/settings/content" class="h3 small"> Edit in Settings. </a>
        </div>
      {/if}
    </div>
  </Container>
</Main>
