<script lang="ts">
  import { page } from '$app/stores';
  import { App } from '$lib/stores/app';
  import {
    blankMessage,
    type MessageComposerEvent,
    messages_payload_validator,
    type MessagesPayload,
    type DraftTextMessage
  } from '$lib/zod/Message';
  import { createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';
  import Button from '../Button.svelte';
  import Icon from '../Icon.svelte';
  import TextComposer from './TextComposer.svelte';

  export let placeholder: string = `Write a message…`;
  export let always_active: boolean = false;

  const controller = writable<MessagesPayload>([blankMessage()]);
  const controls = writable('');
  const pending = writable(false);
  const try_again = writable(false);
  const dispatch = createEventDispatcher();

  let is_focused = false;
  let can_autofocus = false;

  $: is_valid = messages_payload_validator.safeParse($controller).success;
  $: is_active =
    always_active ||
    is_focused ||
    ($controller[0].type === 'text' && $controller[0].content_raw !== '');

  const reset = (success: boolean) => {
    if (success) $controller = [blankMessage()];
    $pending = false;
    $try_again = success === false;
  };

  const handleSubmit = (e: any) => {
    if (!$page.data.my_nametag) {
      $App.sheet_id = 'onboarding';
      e.preventDefault();
      return false;
    }

    if (is_valid) {
      $pending = true;
      can_autofocus = true;
      dispatch('message', {
        messages: $controller,
        completeCallback: reset
      } as MessageComposerEvent);
    }
  };

  const focus = () => {
    is_focused = true;
    dispatch('active', { is_active });
  };

  const addMoreClick = () => {
    controller.update((prev) => {
      prev.push(blankMessage());
      return prev;
    });
  };

  const discardClick = () => {
    controller.update((prev) => {
      prev = [blankMessage()];
      return prev;
    });

    is_focused = false;
    $controls = '';
  };

  const deleteText = (e: CustomEvent<DraftTextMessage>) => {
    controller.update((prev) => {
      prev.forEach((item, index) => {
        if (item === e.detail) prev.splice(index, 1);
      });

      return prev;
    });
  };
</script>

<form on:submit|preventDefault={handleSubmit}>
  <div
    class="composer"
    data-flex="v"
    data-theme={$page.data.my_nametag?.theme}
    data-gap
    data-padded
    class:active={is_active}
  >
    <div class="row" data-flex="ae" data-gap>
      <div class="messages" data-flex="v" data-gap>
        {#each $controller as message (message)}
          {#if message.type === 'text'}
            <TextComposer
              bind:message
              on:focus={focus}
              on:focus
              on:blur
              {placeholder}
              controller={controls}
              can_delete={$controller.length > 1}
              autofocus={can_autofocus}
              disabled={$pending}
              on:submit={handleSubmit}
              on:delete={deleteText}
            />
          {/if}
        {/each}
      </div>
      {#if is_active}
        <Button
          id="submit"
          type="submit"
          icon="keyboard_return"
          label="Send"
          large
          primary
          disabled={!is_valid || $pending}
        />
      {/if}
    </div>
    {#if is_active}
      {#if $try_again}
        <p data-error>
          <Icon icon="info" />
          Something went wrong! <span class="half thin">Try again.</span>
        </p>
      {/if}
      <div data-flex="sb">
        <div data-button-row>
          <Button
            id="add_pic"
            icon="add_photo_alternate"
            label="Add pics"
            controller={controls}
            disabled={$pending}
          />
          <Button
            id="add_links"
            label="Add link"
            icon="add_link"
            controller={controls}
            disabled={$pending}
          />
          <Button
            id="add_more"
            label="Add more"
            icon="post_add"
            controller={controls}
            disabled={$pending}
            on:click={addMoreClick}
          />
        </div>
        <div data-button-row>
          {#if is_valid}
            <Button
              id="clear"
              icon="cancel"
              label="Discard"
              controller={controls}
              disabled={$pending}
              on:click={discardClick}
            />
          {/if}
        </div>
      </div>
    {/if}
  </div>
</form>

<style lang="scss">
  .composer {
    max-height: 220px;
    overflow-y: auto;
  }

  .composer:not(.active) {
    padding-top: 0;
    padding-bottom: 0;
  }

  // [data-padded].active {
  //   border-top: 1px solid rgba(var(--dark), 0.25);
  //   border-bottom: 1px solid rgba(var(--dark), 0.75);
  // }

  .messages {
    flex: 1;
  }

  [data-error] {
    margin-top: 0;
    align-self: flex-start;
  }
</style>
