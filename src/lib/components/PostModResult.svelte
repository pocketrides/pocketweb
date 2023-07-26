<script lang="ts">
  import type { ServerPost } from '$lib/zod/Post';
  import type { Writable } from 'svelte/store';
  import { slide } from 'svelte/transition';
  import Button from './Button.svelte';
  import Container from './Container.svelte';
  import Icon from './Icon.svelte';
  import ButtonRow from './ButtonRow.svelte';

  export let post_controller: Writable<ServerPost | undefined>;
  export let showing_mod_result: Writable<boolean>;
  export let post_hidden: boolean;
</script>

{#if $post_controller && $showing_mod_result && !post_hidden}
  <div in:slide out:slide>
    <Container fill="superlight">
      <div data-flex="v as" data-gap="1">
        <h3>
          <Icon icon="info" />
          Heads up!
        </h3>
        <p>
          Your post failed the platform's automatic checks, so likes have been turned
          off. Think we got it wrong? Tap <strong>
            <Icon inline icon="quick_reference" /> Dispute
          </strong> and we'll review it.
        </p>
        <p>
          To re-scan your content, tap <strong>
            <Icon inline icon="edit" /> Edit post
          </strong> and follow the instructions.
        </p>
        <ButtonRow let:controller initial="dispute">
          <Button
            id="dispute"
            large
            {controller}
            icon="quick_reference"
            label="Dispute"
            on:click={() => {
              if ($post_controller)
                window.open(
                  `mailto:hello@pocketrides.cc?subject=dispute&body=` +
                    encodeURIComponent(
                      `Hello, I think my post was incorrectly moderated. It says:\n\n\t\t${$post_controller.contents[0].content_raw}\n\nThe moderator said the following:\n\n\t\t${$post_controller.settings.mod_result?.response_text}\n\nLink to the post: https://pocketrides.com/post/${$post_controller.id}\n\nThanks!`
                    )
                );
            }}
          />
          <Button
            id="edit"
            large
            {controller}
            icon="edit"
            label="Edit post"
            href={`/post?edit=${$post_controller.id}`}
          />
        </ButtonRow>
      </div>
      <p class="small half" data-ph>
        <Icon icon="visibility_off" /> Only you can see this.
      </p>
    </Container>
  </div>
{/if}
