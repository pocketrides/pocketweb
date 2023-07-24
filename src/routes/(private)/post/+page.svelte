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
  import type { PageData } from './$types';
  import { page } from '$app/stores';
  import AddToWorldfeed from './ui/AddToWorldfeed.svelte';
  import WorldfeedHelp from '$lib/sheets/worldfeed/WorldfeedHelp.svelte';
  import { EditPostRequest } from '$lib/api/post/edit';

  export let data: PageData;

  $: $App.theme = data.my_nametag.theme;
  // $: $App.fill = 'system-light';

  const page_controller = writable<PageController>(
    data.post ? data.post : blankPost(data.pocket ? data.pocket.id : undefined)
  );
  const is_publishing = writable(false);
  const publish_error = writable(false);
  const nav_controller = writable(data.post ? 'save' : 'publish');
  const almost_done = writable(false);

  let publish_target = data.pocket
    ? `pocket:${data.pocket.id}`
    : data.post?.audience || 'friends'; // pocket:123…
  $: target_and_pocket = publish_target.split(':');
  $: $page_controller.audience = target_and_pocket[0] as
    | 'friends'
    | 'close_friends'
    | 'pocket';
  $: $page_controller.pocket_id = target_and_pocket[1] || undefined;
  $: if ($page_controller.audience !== 'friends')
    $page_controller.settings.worldfeed = null;

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
      $almost_done = true;
      goto(`/post/${post.post_id}`, { invalidateAll: true });
    }

    if (post.success === false) {
      $is_publishing = false;
      $publish_error = true;
    }
  };

  const saveClick = async () => {
    if (!data.edit_id) return;

    $is_publishing = true;

    const post = await EditPostRequest.post({
      edit_id: data.edit_id,
      post: $page_controller
    });

    if (post.success) {
      $almost_done = true;
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
  <div slot="right">
    <ButtonRow let:controller initial="cancel">
      <Button
        {controller}
        id="content"
        icon="help"
        label="Content guide"
        on:click={() => {
          $App.sheet_id = 'content_guide';
        }}
      />
      {#if data.post}
        <Button
          {controller}
          id="cancel"
          icon="cancel"
          label="Cancel"
          on:click={() => {
            history.go(-1);
          }}
        />
      {/if}
    </ButtonRow>
  </div>
</SiteHeader>
<Main padded={false} fullheight fill="white">
  <Posts store={page_controller} />
  {#if $page_controller.settings.is_nsfw || $page_controller.settings.enable_likes === false}
    <Container>
      <div data-flex="v" class="half">
        <h3>
          {#if $page_controller.settings.is_nsfw && $page_controller.settings.enable_likes === false}
            This post is marked NSFW and likes are disabled.
          {:else if $page_controller.settings.enable_likes === false}
            Likes are not enabled.
          {/if}
        </h3>
        <p>
          Disable NSFW and enable likes to re-scan your content. Tap
          <strong><Icon icon="settings" inline /> Settings</strong> at the bottom to make
          changes.
        </p>
        {#if $page_controller.settings.mod_result?.response_text}
          <h3 data-ph>Here's what the AI said:</h3>
          <p>
            {$page_controller.settings.mod_result?.response_text}
          </p>
        {/if}
      </div>
    </Container>
  {/if}
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
        {#if !data.post}
          <Button
            id="discard"
            icon="delete"
            label="Discard"
            controller={nav_controller}
            large
            on:click={() => {
              history.go(-1);
            }}
          />
        {/if}
      </ButtonRow>
    </div>
    <div slot="right">
      {#if data.post}
        <Button
          id="save"
          label="Save…"
          icon="signpost"
          disabled={!valid}
          primary
          controller={nav_controller}
          on:click={publishSheetClick}
        />
      {:else}
        <Button
          id="publish"
          label="Publish to…"
          icon="signpost"
          disabled={!valid}
          primary
          controller={nav_controller}
          on:click={publishSheetClick}
        />
      {/if}
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
  <div data-flex="v" data-gap="1">
    {#if $page.data.my_nametag?.stripe?.has_sub}
      <div data-flex="v" data-gap>
        <Radio
          bind:group={publish_target}
          value="friends"
          label="Followers"
          icon="public"
          xlarge
        />
        <Radio
          bind:group={publish_target}
          value="close_friends"
          label="Close Friends"
          icon="favorite"
          icon_filled
          xlarge
        />
        {#if $page_controller.audience === 'friends'}
          <AddToWorldfeed {page_controller} />
        {/if}
      </div>
    {/if}
    <div data-flex="v" data-gap>
      <h2>Pockets:</h2>
      {#each data.all_pockets.pockets as pocket (pocket)}
        <Radio
          bind:group={publish_target}
          value={`pocket:${pocket.id}`}
          icon="hail"
          label={pocket.name_raw.replace(/\n/g, ' ')}
          xlarge
        />
      {/each}
      {#each data.all_pockets.cohosted_pockets as pocket (pocket)}
        <Radio
          bind:group={publish_target}
          value={`pocket:${pocket.id}`}
          icon="hail"
          label={pocket.name_raw.replace(/\n/g, ' ')}
          xlarge
        />
      {/each}
      {#each data.all_pockets.unlisted_pockets as pocket (pocket)}
        <Radio
          bind:group={publish_target}
          value={`pocket:${pocket.id}`}
          icon="hail"
          label={pocket.name_raw.replace(/\n/g, ' ')}
          xlarge
        />
      {/each}
      {#each data.all_pockets.joined_pockets as pocket (pocket)}
        <Radio
          bind:group={publish_target}
          value={`pocket:${pocket.id}`}
          icon="hail"
          label={pocket.name_raw.replace(/\n/g, ' ')}
          xlarge
        />
      {/each}
    </div>
  </div>
  <div slot="nav" data-fill="system-superlight">
    <Container padded>
      <div data-flex="v" data-gap>
        {#if data.post}
          <Button
            label={$is_publishing
              ? $almost_done
                ? 'Almost done!'
                : 'One sec!'
              : 'Save'}
            primary
            xlarge
            disabled={!valid || $is_publishing}
            on:click={saveClick}
          />
        {:else}
          <Button
            label={$is_publishing
              ? $almost_done
                ? 'Almost done!'
                : 'One sec!'
              : 'Publish'}
            primary
            xlarge
            disabled={!valid || $is_publishing}
            on:click={publishClick}
          />
        {/if}
        {#if $publish_error}
          <p data-error>Something went wrong! Try again?</p>
        {/if}
      </div>
    </Container>
  </div>
</Sheet>
<Sheet id="has_rejected_media" header="Heads up" icon="info">
  <Container padded fill="system-superlight">
    <div data-flex="v" data-gap="1">
      <div data-flex="v" data-gap>
        <h2>This pic failed the platform's automatic content checks.</h2>
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
<Sheet id="content_guide" header="Content Guide" icon="help">
  <div data-flex="v" data-richtext>
    <h2>How to create a great post.</h2>
    <p>
      Post what you want: links and pics, add as much text as you want, and edit your
      post whenever you want.
    </p>
    <h2>Support your community.</h2>
    <p>
      Telling a great story or sharing a useful tip is a great way to support your
      community.
    </p>
    <h2>Create original content, without spamming.</h2>
    <p>
      Don't post copyrighted work or other people's content. What you can add to the
      conversation is inherently valuable, and we encourage you to add unique value
      every time you post. The platform doesn't support posting the same content to
      multiple places at once. Instead, create a new post every time, tailored to
      your audience.
    </p>
    <h2>Monetization and moderation.</h2>
    <p>
      We moderate content for monetization. That means if your content can't be
      monetized (per Stripe's <a
        href="https://stripe.com/legal/restricted-businesses"
        target="_blank"
        rel="noreferrer">Prohibited and Restricted Businesses</a
      >), we disable monetization, prevent it from appearing on the Worldfeed, and
      mark it as NSFW.
    </p>
    <p>
      We take a very opinionated stance on NSFW ("Not Safe For Work") content. If
      your content doesn't pass the platform's monetization checks, we will
      automatically enable NSFW mode. Only subscribers can see NSFW content. You can
      always dispute content that fails the automated checks.
    </p>
  </div>
</Sheet>
<WorldfeedHelp />
