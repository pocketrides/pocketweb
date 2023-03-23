<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import { NametagUpdate } from '$lib/api/nametag/update';
  import Button from '$lib/components/Button.svelte';
  import Checkbox from '$lib/components/Checkbox.svelte';
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import { writable } from 'svelte/store';

  const saving_nsfw_posts_pref = writable(false);

  let allow_nsfw_posts =
    $page.data.my_nametag?.content_prefs?.allow_nsfw_posts || false;

  const updateNSFWPostsPref = async () => {
    $saving_nsfw_posts_pref = true;
    await NametagUpdate.post({
      content_prefs: {
        allow_nsfw_posts
      }
    });

    await invalidateAll();
    $saving_nsfw_posts_pref = false;
  };
</script>

<svelte:head>
  <title>Content Settings | Pocketrides!</title>
</svelte:head>

<SiteHeader utility>
  <div slot="left">
    <Button
      label="Back"
      icon="arrow_back_ios"
      small
      on:click={() => {
        window.history.go(-1);
      }}
    />
  </div>
  <div slot="right" />
</SiteHeader>
<Main fullheight>
  <div data-flex="v" data-gap="1">
    <h1 data-ph>
      <Icon icon="auto_stories" />
      Content settings
    </h1>
    <Container rounded padded fill="system-superlight" bordered>
      <div data-flex="v as" data-gap>
        <h2>NSFW posts</h2>
        <p>
          Pocketrides is a place for everyone, and sometimes it gets a little spicy.
          Adult content never earns money on Pocketrides, but it's up to you if you
          want to see it by default.
        </p>
        <div data-flex data-gap>
          <Checkbox
            bind:checked={allow_nsfw_posts}
            label="Show by default"
            on:change={updateNSFWPostsPref}
            disabled={$saving_nsfw_posts_pref}
          />
          {#if $saving_nsfw_posts_pref}
            <p class="half">
              <Icon icon="autorenew" spins />
              Saving…
            </p>
          {/if}
        </div>
      </div>
    </Container>
  </div>
</Main>
