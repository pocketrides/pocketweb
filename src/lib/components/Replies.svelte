<script lang="ts">
  import type { ServerPost } from '$lib/zod/Post';
  import type { ServerReply } from '$lib/zod/Reply';
  import { writable } from 'svelte/store';
  import Button from './Button.svelte';
  import Container from './Container.svelte';
  import Reply from './Reply.svelte';
  import Row from './Row.svelte';

  export let post: ServerPost;
  export let initial: 'preview' | 'expanded' = 'preview';

  const test_stats = (): ServerReply['stats'] => ({
    likes: 0,
    quarantines: 0,
    replies: 0
  });

  const test_replies: ServerReply[] = [
    {
      nametag_ref: { id: '123' },
      post_ref: { id: '123' },
      nametag: {
        id: '123',
        nametag: 'caleb',
        theme: 'sky',
        account_ref: { id: '' }
      },
      content:
        'first comment baby!! lorem ipsum, dolor sit amet. consecutor etceter and so forth. lorem ipsum, dolor sit amet. consecutor etceter and so forth. lorem ipsum, dolor sit amet. consecutor etceter and so forth. ',
      stats: test_stats()
    },
    {
      nametag_ref: { id: '123' },
      post_ref: { id: '123' },
      nametag: {
        id: '123',
        nametag: 'caleb',
        theme: 'sky',
        account_ref: { id: '' }
      },
      content: 'wow love it babe',
      stats: test_stats()
    },
    {
      nametag_ref: { id: '123' },
      post_ref: { id: '123' },
      nametag: {
        id: '355346802567807059',
        nametag: '🤠 MG',
        theme: 'teal',
        account_ref: { id: '' }
      },
      content: 'yasssss',
      stats: test_stats()
    }
  ];

  const controller = writable({
    display_mode: initial,
    post,
    replies: test_replies
  });

  const getTopReplies = () => {
    return $controller.replies.map((r) => r).slice(0, 2);
  };
</script>

<div data-fill="system-light">
  {#if $controller.display_mode === 'preview'}
    <div data-fill="superlight" data-padded data-3d="ah">
      <h3 class="half">Top replies</h3>

      <div data-flex="v">
        {#each getTopReplies() as reply (reply)}
          <Reply {reply} initial={$controller.display_mode} />
        {/each}
      </div>
    </div>
  {:else}
    <div>
      <div data-flex="v">
        <Row fill="system-superlight" padded>
          <h3 slot="left">All replies</h3>
          <Button
            slot="right"
            label="Close"
            on:click={() => {
              $controller.display_mode = 'preview';
            }}
          />
        </Row>
        {#each $controller.replies as reply (reply)}
          <Reply {reply} initial={$controller.display_mode} />
        {/each}
      </div>
    </div>
  {/if}
</div>
