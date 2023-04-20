<script lang="ts">
  import { page } from '$app/stores';
  import AddPics from '$lib/components/AddPics.svelte';
  import Button from '$lib/components/Button.svelte';
  import ButtonRow from '$lib/components/ButtonRow.svelte';
  import Container from '$lib/components/Container.svelte';
  import Gallery from '$lib/components/Gallery.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Main from '$lib/components/Main.svelte';
  import NametagWithPic from '$lib/components/NametagWithPic.svelte';
  import PocketRenderer from '$lib/components/pockets/PocketRenderer.svelte';
  import Radio from '$lib/components/Radio.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import UtilityNav from '$lib/components/UtilityNav.svelte';
  import Cohosts from '$lib/sheets/pockets/Cohosts.svelte';
  import { App } from '$lib/stores/app';
  import type { CloudinaryPhoto } from '$lib/zod/CloudinaryPhoto';
  import {
    blankPocket,
    draft_pocket_validator,
    type DraftPocket
  } from '$lib/zod/Pocket';
  import { THEME_NAMES, THEME_VALUES } from '$lib/zod/Theme';
  import { writable } from 'svelte/store';
  import type { PageData } from './$types';
  import Guide from './ui/Guide.svelte';
  import DetailsNav from './ui/DetailsNav.svelte';
  import Description from './ui/form/Description.svelte';
  import Links from './ui/form/Links.svelte';
  import Name from './ui/form/Name.svelte';
  import Place from './ui/form/Place.svelte';
  import Time from './ui/form/Time.svelte';
  import { page_label } from './ui/store';
  import { NewPocketRequest } from '$lib/api/pocket/new';
  import { goto } from '$app/navigation';
  import { UpdatePocketRequest } from '$lib/api/pocket/update';
  import { DeletePocketRequest } from '$lib/api/pocket/delete';
  import AddToWorldfeed from './ui/AddToWorldfeed.svelte';
  import WorldfeedHelp from '$lib/sheets/worldfeed/WorldfeedHelp.svelte';

  export let data: PageData;

  $page_label = 'directions';

  const page_controller = writable<DraftPocket>(
    data.editing_pocket || blankPocket(data.my_nametag.theme)
  );
  const publishing = writable(false);
  const publish_error = writable(false);
  const redirecting = writable(false);
  const deleting = writable(false);

  $: $App.theme = $page_controller.theme;
  $App.fill = 'dark';

  $: valid = draft_pocket_validator.safeParse($page_controller).success;
  $: if ($page_controller.settings.visibility !== 'listed')
    $page_controller.settings.worldfeed = null;

  const handlePicsUploaded = (e: CustomEvent<CloudinaryPhoto[]>) => {
    page_controller.update((prev) => {
      prev.cover_art.push(...e.detail);
      return prev;
    });
  };

  const photoDeleted = (e: CustomEvent<CloudinaryPhoto>) => {
    page_controller.update((prev) => {
      const i = prev.cover_art.findIndex((p) => p === e.detail);
      prev.cover_art.splice(i, 1);
      return prev;
    });
  };

  const handlePublishClick = async () => {
    $publishing = true;
    $publish_error = false;

    const res = await NewPocketRequest.post($page_controller);

    if (res.success) {
      $redirecting = true;
      goto(`/pocket/${res.pocket_id}`, { invalidateAll: true });
    } else {
      $publishing = false;
      $publish_error = true;
    }
  };

  const handleEditSaveClick = async () => {
    if (!data.editing_pocket || !data.editing_pocket_id) return;

    $publishing = true;
    $publish_error = false;

    const res = await UpdatePocketRequest.post({
      pocket_id: data.editing_pocket_id,
      pocket: $page_controller
    });

    if (res.success) {
      $redirecting = true;
      goto(`/pocket/${res.pocket_id}`, { invalidateAll: true });
    } else {
      $publishing = false;
      $publish_error = true;
    }
  };

  const handlePocketDeleteClick = async () => {
    if (!data.editing_pocket || !data.editing_pocket_id) return;

    if (
      !confirm(
        `You better be sure you wanna delete this 'cause it's gone if you click OK.`
      )
    )
      return;

    $deleting = true;

    const res = await DeletePocketRequest.post({
      pocket_id: data.editing_pocket_id
    });

    if (res.success) {
      $redirecting = true;
      goto(`/profile/${$page.data.my_nametag?.id}/pockets`, { invalidateAll: true });
    } else {
      $deleting = false;
      alert('Try again, something went wrong.');
    }
  };
</script>

<svelte:head>
  <title>new pocket | on pocketrides!</title>
</svelte:head>

<SiteHeader fill="dark" huddable>
  <h2 slot="left" class:half={!$page_controller.cover_art.length} class="nowraps">
    <Icon icon="hail" />
    {#if data.editing_pocket}
      <span class="nowraps">
        Editing "{data.editing_pocket.name_raw.replace(/\n/g, ' ')}"
      </span>
    {:else}
      New Pocket
    {/if}
  </h2>
  <div slot="right">
    {#if data.editing_pocket_id}
      <Button label="Cancel" href={`/pocket/${data.editing_pocket_id}`} />
    {/if}
  </div>
  <Gallery
    photos={$page_controller.cover_art}
    square={false}
    allow_delete
    slot="gallery"
    on:delete={photoDeleted}
  />
</SiteHeader>
<Main fullheight fullwidth padded={false}>
  <PocketRenderer details_enabled={$page_controller.details_enabled}>
    <Container slot="name">
      {#if data.free_mode}
        <Container rounded fill="superdark">
          {#if data.can_free_mode_publish}
            <p class=" half">
              <Icon icon="info" />
              <strong>You're in free mode.</strong>
            </p>
            <p class=" half">Thanks for trying Pocketrides ♥️</p>
          {:else}
            <p class="h3 half">
              <Icon icon="info" />
              You're out of free pockets.
            </p>
          {/if}
        </Container>
      {/if}
      <div data-flex="v" data-gap data-ph>
        <Name store={page_controller} />
        {#if $page_controller.hosts.length}
          <div data-flex="v" data-gap>
            <h2>Hosted by:</h2>
            <div data-flex="scroll-h" data-gap>
              {#if $page.data.my_nametag}
                <NametagWithPic nametag={$page.data.my_nametag} large />
              {/if}
              {#each $page_controller.hosts as host (host)}
                <NametagWithPic nametag={host} large />
              {/each}
            </div>
          </div>
        {/if}
        <ButtonRow>
          <Button
            id="directions"
            label="Want a hint?"
            icon="directions_run"
            superdark
            controller={page_label}
            on:click={() => {
              $App.sheet_id = 'pocket_guide';
            }}
          />
          <AddPics
            controller={page_label}
            label="Add poster"
            on:uploaded={handlePicsUploaded}
          />
          <Button
            controller={page_label}
            label="Add Cohosts"
            icon="campaign"
            on:click={() => {
              $App.sheet_id = 'pocket_cohosts';
            }}
          />
        </ButtonRow>
      </div>
    </Container>
    <Time slot="time" {page_controller} />
    <Place slot="place" {page_controller} />
    <Links slot="links" {page_controller} />
    <Description slot="desc" {page_controller} />
    <DetailsNav {page_controller} />
  </PocketRenderer>
  <UtilityNav slot="utility-nav">
    <div slot="left">
      <ButtonRow>
        <div data-3d-container>
          {#if $page_label === 'theme'}
            <select data-sham bind:value={$page_controller.theme}>
              <optgroup label="Pick!">
                {#if data.my_nametag.theme === 'system'}
                  <option value="system">System</option>
                {/if}
                {#each THEME_NAMES as name, i}
                  <option value={THEME_VALUES[i]}>{name}</option>
                {/each}
              </optgroup>
            </select>
          {/if}
          <Button
            id="theme"
            icon="palette"
            label="Change color"
            large
            controller={page_label}
          />
        </div>
        {#if data.editing_pocket_id}
          <Button
            id="discard"
            icon="delete"
            label="Delete"
            large
            controller={page_label}
            on:click={handlePocketDeleteClick}
          />
        {:else}
          <Button
            id="discard"
            icon="delete"
            label="Discard"
            large
            controller={page_label}
            on:click={() => {
              history.go(-1);
            }}
          />
        {/if}
      </ButtonRow>
    </div>
    <div slot="right">
      {#if typeof data.editing_pocket === 'undefined'}
        <Button
          id="publish"
          label="Publish…"
          icon="hail"
          disabled={valid !== true ||
            (data.free_mode === true && data.can_free_mode_publish === false)}
          primary
          controller={page_label}
          on:click={() => {
            $App.sheet_id = 'pocket_publish';
          }}
        />
      {:else}
        <Button
          id="save"
          label="Save…"
          icon="hail"
          disabled={valid !== true}
          primary
          controller={page_label}
          on:click={() => {
            $App.sheet_id = 'pocket_publish';
          }}
        />
      {/if}
    </div>
  </UtilityNav>
</Main>

<Guide />
<Cohosts {page_controller} />
<Sheet
  id="pocket_publish"
  header="Publish Pocket"
  icon="hail"
  dismissable={!$publishing}
>
  <div data-flex="v" data-gap="1">
    <div data-flex="v" data-gap>
      <p class="h2" id="pocket_visibility">Who can see it?</p>
      <Radio
        label="It's public"
        bind:group={$page_controller.settings.visibility}
        value="listed"
        labelled_by="pocket_visibility"
        icon="public"
        xlarge
      />
      <Radio
        label="Hide it from my profile"
        bind:group={$page_controller.settings.visibility}
        value="unlisted"
        labelled_by="pocket_visibility"
        icon="visibility_off"
        xlarge
      />
      <p class="half h3">
        {#if $page_controller.settings.visibility === 'listed'}
          Your pocket will show up on your profile page{#if $page_controller.settings.worldfeed}
            &nbsp;or on the Worldfeed, depending on search terms and number of
            members
          {/if}.
        {:else}
          <Icon icon="visibility_off" multiline />
          Unlisted. Your pocket's only visible to you, or people you send the link to.
        {/if}
      </p>
    </div>
    <div data-flex="v" data-gap>
      <p class="h2" id="pocket_joinability">Who can join it?</p>
      <Radio
        label="Anyone, automatically"
        value="anyone"
        bind:group={$page_controller.settings.joinability}
        labelled_by="pocket_joinability"
        xlarge
      />
      <Radio
        label="Let me approve"
        value="moderated"
        bind:group={$page_controller.settings.joinability}
        labelled_by="pocket_joinability"
        xlarge
      />
      <Radio
        label="Broadcast Mode"
        value="broadcast"
        bind:group={$page_controller.settings.joinability}
        labelled_by="pocket_joinability"
        xlarge
      />
      <p class="half h3">
        {#if $page_controller.settings.joinability === 'anyone'}
          {#if $page_controller.settings.visibility === 'unlisted'}
            Anyone with the link can join automatically.
          {:else}
            Anyone who can join automatically.
          {/if}
        {:else if $page_controller.settings.joinability === 'moderated'}
          <Icon icon="shield_with_heart" multiline />
          Private Mode. Hosts approve each person requesting to join.
        {:else}
          <Icon icon="edit_off" multiline />
          Broadcast Mode. Friends will follow your Pocket instead of joining. This means
          they won't be able to make posts of their own, and Chat is disabled.
        {/if}
      </p>
    </div>
    {#if $page_controller.settings.visibility === 'listed'}
      <AddToWorldfeed {page_controller} />
    {/if}
    {#if typeof data.editing_pocket_id === 'undefined'}
      <Button
        label={$publishing
          ? $redirecting
            ? 'Almost done!'
            : 'One sec!'
          : 'Publish'}
        disabled={$publishing || $redirecting}
        xlarge
        primary
        on:click={handlePublishClick}
      />
    {:else}
      <Button
        label={$publishing ? ($redirecting ? 'Almost done!' : 'One sec!') : 'Save'}
        disabled={$publishing || $redirecting}
        xlarge
        primary
        on:click={handleEditSaveClick}
      />
    {/if}
    {#if $publish_error}
      <div>
        <p class="h3">Something went wrong! Try again.</p>
      </div>
    {/if}
    <div data-flex="cc">
      <Button
        label="Go back"
        disabled={$publishing}
        on:click={() => {
          $App.sheet_id = '';
        }}
      />
    </div>
  </div>
</Sheet>
<WorldfeedHelp />
