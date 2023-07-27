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

<SiteHeader huddable>
  <h1 slot="left">
    <Icon icon="no_adult_content" />
    NSFW Warning
  </h1>
  <span slot="right" />
</SiteHeader>
<Main fullheight>
  <Container>
    <div data-flex="v as" data-gap="1">
      <div data-flex="v" data-gap>
        <h2>
          <Icon icon="info" inline />
          Heads up! <span class="half">Post is NSFW.</span>
        </h2>
        {#if $page.data.my_nametag?.stripe?.has_sub !== true}
          <p>You need a subscription to see content marked Not Safe For Work.</p>
        {/if}
        {#if $page.data.my_nametag?.id === data.post?.nametag.id}
          <p>
            Tap <strong><Icon icon="edit" inline /> Edit post</strong> and follow the
            instructions to scan it again.
          </p>
        {/if}
      </div>
      <ButtonRow let:controller initial="safety">
        <Button
          id="safety"
          icon="home"
          label="Go home"
          primary
          large
          {controller}
          href="/"
        />
        {#if $page.data.my_nametag?.stripe?.has_sub === true || $page.data.my_nametag?.id === data.post?.nametag?.id}
          <Button
            id="continue"
            icon="visibility"
            label="Continue"
            large
            href={`/post/${data.post_id}?ok=1`}
            {controller}
          />
        {/if}
        {#if $page.data.my_nametag?.id === data.post?.nametag?.id}
          <Button
            id="edit"
            icon="edit"
            label="Edit post"
            large
            href={`/post?edit=${data.post_id}`}
            {controller}
          />
        {/if}
      </ButtonRow>
      {#if $page.data.my_nametag?.stripe?.has_sub === true}
        <div data-ph class="half small">
          Rather not be warned?
          <a href="/settings/content" class="h3 small"> Edit in Settings. </a>
        </div>
      {/if}
    </div>
  </Container>
</Main>
