<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import UtilityNav from '$lib/components/UtilityNav.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import { blankPost, draft_posts_validator } from '$lib/zod/Post';
  import { writable } from 'svelte/store';
  import Posts from './ui/Posts.svelte';
  import type { PageController } from './ui/types';
  import { App } from '$lib/stores/app';
  import Radio from '$lib/components/Radio.svelte';

  const page_controller = writable<PageController>({
    target: 'friends',
    posts: [blankPost()]
  });

  const settingsClick = () => {
    $App.sheet_id = 'post_settings';
  };

  const publishClick = () => {
    $App.sheet_id = 'post_publish';
  };

  $: valid = draft_posts_validator.safeParse($page_controller.posts).success;

  $: console.log($page_controller);
</script>

<svelte:head>
  <title>New post | pocketrides!</title>
</svelte:head>

<SiteHeader utility>
  <div slot="left">
    <h1 class="h2">
      <Icon icon="signpost" />
      New post
    </h1>
  </div>
  <div slot="right">
    <Button label="Cancel" href="/home" />
  </div>
</SiteHeader>
<Main>
  <Posts store={page_controller} />
  <UtilityNav slot="utility-nav">
    <div slot="left">
      <Button label="Settings" large on:click={settingsClick} />
    </div>
    <div slot="right">
      <Button
        label="Publish to…"
        disabled={!valid}
        primary
        on:click={publishClick}
      />
    </div>
  </UtilityNav>
</Main>
<Sheet id="post_settings" header="Post settings" icon="settings">
  <h2>Privacy</h2>
  <h2>Likes</h2>
</Sheet>
<Sheet id="post_publish" header="Publish to" icon="signpost">
  <div data-flex="v" data-gap>
    <Radio
      bind:group={$page_controller.target}
      value="friends"
      label="Friends"
      xlarge
    />
    <Radio
      bind:group={$page_controller.target}
      value="close_friends"
      label="Close Friends"
      xlarge
    />
    <Button label="Publish" primary xlarge />
  </div>
</Sheet>
