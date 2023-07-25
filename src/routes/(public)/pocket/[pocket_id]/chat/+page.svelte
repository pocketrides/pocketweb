<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  import Main from '$lib/components/Main.svelte';
  import Row from '$lib/components/Row.svelte';
  import UtilityNav from '$lib/components/UtilityNav.svelte';
  import MessageComposer from '$lib/components/messaging/MessageComposer.svelte';
  import { onDestroy, onMount } from 'svelte';
  import type { PageData } from './$types';
  import { scrollToEnhanced } from '$lib/util/scroll-to';
  import { Room, type RoomConnection } from '$lib/api/room';
  import { writable } from 'svelte/store';
  import { page } from '$app/stores';
  import type { MessageComposerEvent } from '$lib/zod/Message';
  import { browser } from '$app/environment';
  import { ChatRequest } from '$lib/api/chat/chat';
  import type { ClientChat } from '$lib/zod/Chat';
  import Replies from '$lib/components/replies/Replies.svelte';
  import Container from '$lib/components/Container.svelte';
  import Reply from '$lib/components/replies/Reply.svelte';
  import Chats from '$lib/components/chat/Chats.svelte';

  export let data: PageData;

  const pocket = writable(data.pocket);
  const chats = writable(data.chats);

  $: $pocket = data.pocket;
  $: $chats = data.chats;

  let room: RoomConnection | undefined;
  let reconnect_count = 0;

  onMount(async () => {
    if (browser) {
      await connect();
      scrollToBottom();
    }
  });

  onDestroy(() => {
    disconnect();
  });

  const connect = async () => {
    room = await Room.connect('pocket', $pocket.id, $page.data.room_key);

    room?.handleMessage((msg) => {
      chats.update((prev) => {
        prev.push(msg as ClientChat);

        return prev;
      });
    });

    room?.handleEarlyDisconnect(() => {
      reconnect_count++;

      if (reconnect_count > 3) return;

      setTimeout(async () => {
        disconnect();
        connect();
      }, 2000);
    });
  };

  const disconnect = () => {
    room?.disconnect();
    room = undefined;
  };

  const handleMessage = async (e: CustomEvent<MessageComposerEvent>) => {
    const res = await ChatRequest.post({
      pocket_id: $pocket.id,
      messages: e.detail.messages
    });

    if (res.success && res.chat) {
      e.detail.completeCallback(true);

      chats.update((prev) => {
        if (res.chat) {
          let msg = Object.assign(res.chat, { pending: true });
          prev.push(msg);
        }

        return prev;
      });

      room?.sendMessage(res.chat, $page.data.room_key);

      scrollToBottom();
    } else {
      e.detail.completeCallback(false);
    }
  };

  const scrollToBottom = () => {
    const main = document.querySelector('main') as HTMLElement;

    if (main) {
      scrollToEnhanced(() => {
        window.scrollTo(
          0,
          main.offsetTop +
            main.offsetHeight -
            (window.visualViewport?.height || window.innerHeight) -
            (window.innerWidth < 640 ? 48 : 0)
        );
      });
    }
  };
</script>

<Main padded={false}>
  <!-- <Row padded bordered>
    <h2 slot="left">
      <Icon icon="chat" />
      Chat
    </h2>
  </Row> -->
  <Chats {chats} />

  <MessageComposer
    always_active
    on:message={handleMessage}
    on:active={scrollToBottom}
  />
</Main>
