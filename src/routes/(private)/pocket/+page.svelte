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

  export let data: PageData;

  $page_label = 'directions';

  const page_controller = writable<DraftPocket>(blankPocket(data.my_nametag.theme));
  const publishing = writable(false);
  const publish_error = writable(false);

  $: $App.theme = $page_controller.theme;
  $App.fill = 'dark';

  $: valid = draft_pocket_validator.safeParse($page_controller).success;

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
      goto(`/pocket/${res.pocket_id}`, { invalidateAll: true });
    } else {
      $publish_error = true;
    }

    $publishing = false;
  };
</script>

<svelte:head>
  <title>new pocket | on pocketrides!</title>
</svelte:head>

<SiteHeader fill="dark" outer_fill="dark" utility border_disabled>
  <h2 slot="left" class:half={!$page_controller.cover_art.length}>
    <Icon icon="hail" />
    New Pocket
  </h2>
  <div slot="right" />
  <div slot="bottom">
    <Gallery
      photos={$page_controller.cover_art}
      square={false}
      allow_delete
      on:delete={photoDeleted}
    />
  </div>
</SiteHeader>
<Main fullheight fullwidth padded={false}>
  <PocketRenderer details_enabled={$page_controller.details_enabled}>
    <Container slot="name">
      <div data-flex="v" data-gap data-ph>
        <Name store={page_controller} />
        {#if $page_controller.hosts.length}
          <div data-flex="v" data-gap>
            <h2>
              <Icon icon="campaign" />
              Hosted by:
            </h2>
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
            label="Need a hint?"
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
        <Button
          id="discard"
          icon="delete"
          label="Discard"
          large
          href="/home"
          controller={page_label}
        />
      </ButtonRow>
    </div>
    <div slot="right">
      <Button
        id="publish"
        label="Publish…"
        icon="hail"
        disabled={valid !== true}
        primary
        controller={page_label}
        on:click={() => {
          $App.sheet_id = 'pocket_publish';
        }}
      />
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
        xlarge
      />
      <Radio
        label="Hide it from my profile"
        bind:group={$page_controller.settings.visibility}
        value="unlisted"
        labelled_by="pocket_visibility"
        xlarge
      />
      <p class="half ">
        {#if $page_controller.settings.visibility === 'listed'}
          Your pocket will show up on your profile page.
        {:else}
          You'll have to send a link to your friends.
        {/if}
      </p>
    </div>
    <div data-flex="v" data-gap>
      <p class="h2" id="pocket_joinability">Who can join?</p>
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
        label="Broadcast only"
        value="broadcast"
        bind:group={$page_controller.settings.joinability}
        labelled_by="pocket_joinability"
        xlarge
      />
      <p class="half ">
        {#if $page_controller.settings.joinability === 'anyone'}
          Anyone can join automatically.
        {:else if $page_controller.settings.joinability === 'moderated'}
          Hosts approve each person requesting to join.
        {:else}
          Friends can join, but not post.
        {/if}
      </p>
    </div>
    <Button
      label={$publishing ? 'One sec!' : 'Publish'}
      disabled={$publishing}
      xlarge
      primary
      on:click={handlePublishClick}
    />
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
