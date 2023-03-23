<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import UtilityNav from '$lib/components/UtilityNav.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import { blankPost, draft_post_validator } from '$lib/zod/Post';
  import { writable } from 'svelte/store';
  import Posts from './ui/Posts.svelte';
  import type { PageController } from './ui/types';
  import { App } from '$lib/stores/app';
  import Radio from '$lib/components/Radio.svelte';
  import Checkbox from '$lib/components/Checkbox.svelte';
  import { NewPostRequest } from '$lib/api/post/new';
  import { goto } from '$app/navigation';
  import Container from '$lib/components/Container.svelte';
  import { afterUpdate } from 'svelte';
  import ButtonRow from '$lib/components/ButtonRow.svelte';

  const page_controller = writable<PageController>(blankPost());
  const is_publishing = writable(false);
  const publish_error = writable(false);
  const nav_controller = writable('publish');

  const settingsSheetClick = () => {
    $App.sheet_id = 'post_settings';
  };

  const publishSheetClick = () => {
    $App.sheet_id = 'post_publish';
  };

  const publishClick = async () => {
    $is_publishing = true;

    const post = await NewPostRequest.post($page_controller);

    if (post.success) {
      goto(`/post/${post.post_id}`, { invalidateAll: true });
    }

    if (post.success === false) {
      $is_publishing = false;
      $publish_error = true;
    }
  };

  $: valid = draft_post_validator.safeParse($page_controller).success;
  $: has_rejected_photos =
    $page_controller.contents
      .map((c) => c.photos.map((p) => p.aws_rek_status === 'rejected'))
      .flat()
      .indexOf(true) !== -1;

  afterUpdate(() => {
    if (has_rejected_photos && $page_controller.settings.is_nsfw === false) {
      page_controller.update((prev) => {
        prev.settings.is_nsfw = true;
        prev.settings.enable_likes = false;

        return prev;
      });
    }
  });
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
  <div slot="right" />
</SiteHeader>
<Main padded={false} fullheight>
  <Posts store={page_controller} />
  <UtilityNav slot="utility-nav">
    <div slot="left">
      <ButtonRow>
        <Button
          id="settings"
          label="Settings"
          icon="settings"
          primary
          controller={nav_controller}
          on:click={settingsSheetClick}
        />
        <Button
          id="discard"
          icon="delete"
          label="Discard"
          large
          href="/home"
          controller={nav_controller}
        />
      </ButtonRow>
    </div>
    <div slot="right">
      <Button
        id="publish"
        label="Publish to…"
        icon="signpost"
        disabled={!valid}
        primary
        controller={nav_controller}
        on:click={publishSheetClick}
      />
    </div>
  </UtilityNav>
</Main>
<Sheet id="post_settings" header="Post settings" icon="settings">
  <div data-flex="v" data-gap="1">
    <div data-flex="v as" data-gap>
      <div>
        <h2 id="monetize-header">Likes</h2>
        <p>
          If you're posting something that shouldn't make money (like other people's
          content), turn this off.
        </p>
      </div>
      <Checkbox
        bind:checked={$page_controller.settings.enable_likes}
        label="Enable likes"
        labelled_by="monetize-header"
        disabled={$page_controller.settings.is_nsfw}
      />
    </div>
    <div data-flex="v as" data-gap>
      <div>
        <h2 id="replies-header">Replies</h2>
        <p>Anyone can reply unless you turn this off.</p>
      </div>
      <Checkbox
        bind:checked={$page_controller.settings.enable_replies}
        label="Enable replies"
        labelled_by="replies-header"
      />
    </div>
    <div data-flex="v as" data-gap>
      <div>
        <h2 id="nsfw-header">Adult content</h2>
        <p>
          <strong>Help keep everyone safe.</strong> It's fine to upload adult content,
          but please tag it.
        </p>
      </div>
      <Checkbox
        bind:checked={$page_controller.settings.is_nsfw}
        label="It's NSFW"
        labelled_by="nsfw-header"
        disabled={has_rejected_photos}
        on:change={() => {
          $page_controller.settings.enable_likes = false;
        }}
      />
    </div>
  </div>
</Sheet>
<Sheet id="post_publish" header="Publish" icon="signpost">
  <div data-flex="v" data-gap>
    <Radio
      bind:group={$page_controller.audience}
      value="friends"
      label="Friends"
      xlarge
    />
    <Radio
      bind:group={$page_controller.audience}
      value="close_friends"
      label="Close Friends"
      xlarge
    />
    <Button
      label={$is_publishing ? 'One sec!' : 'Publish'}
      primary
      xlarge
      disabled={$is_publishing}
      on:click={publishClick}
    />
    {#if $publish_error}
      <p data-error>Something went wrong! Try again?</p>
    {/if}
  </div>
</Sheet>
<Sheet id="has_rejected_media" header="Heads up" icon="info">
  <Container padded fill="system-superlight">
    <div data-flex="v" data-gap="1">
      <div data-flex="v" data-gap>
        <h2>This pic failed our automatic content checks.</h2>
        <p>
          <strong>Not to worry!</strong> We've turned on NSFW and disabled likes. Thanks
          for making Pocketrides a safe place online!
        </p>
      </div>
      <div data-flex="cc">
        <Button
          label="Got it!"
          on:click={() => {
            $App.sheet_id = '';
          }}
        />
      </div>
    </div>
  </Container>
</Sheet>
