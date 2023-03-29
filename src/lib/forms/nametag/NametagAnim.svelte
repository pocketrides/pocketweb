<script lang="ts">
  import type { ClientNametag } from '$lib/zod/Nametag';
  import Nametag from '$lib/components/Nametag.svelte';
  import Container from '$lib/components/Container.svelte';

  export let rows: ClientNametag[][] = [
    [
      {
        id: '',
        nametag: '🤠 MG',
        theme: 'teal'
      },
      {
        id: '',
        nametag: 'Caleb 👑',
        theme: 'sky'
      },
      {
        id: '',
        nametag: 'Drew 🍭',
        theme: 'lilac'
      },
      {
        id: '',
        nametag: '🤩 Brian',
        theme: 'gold'
      }
    ],
    [
      {
        id: '',
        nametag: 'Tabby 😊',
        theme: 'sky'
      },
      {
        id: '',
        nametag: 'Steph 😍',
        theme: 'pink'
      },
      {
        id: '',
        nametag: '😑 Andrew',
        theme: 'teal'
      },
      {
        id: '',
        nametag: 'gabbi',
        theme: 'lilac'
      }
    ],
    [
      {
        id: '',
        nametag: '🌱 halley',
        theme: 'lilac'
      },
      {
        id: '',
        nametag: '🙂 michelle',
        theme: 'sky'
      },
      {
        id: '',
        nametag: 'Holger 🌲',
        theme: 'pink'
      }
    ]
  ];
</script>

<Container fill="system-superlight" padded={false} bordered rounded>
  <div data-padded>
    <h2>Nametags are better usernames.</h2>
    <p>Add some emojis & pick your favorite color.</p>
  </div>
  <div class="anim" data-fill="system-light">
    <ul data-unstyle data-flex="v" data-gap>
      {#each rows as row}
        <li data-flex data-gap>
          {#each row as nametag}
            <Nametag {nametag} large />
          {/each}
          {#each row as nametag}
            <Nametag {nametag} large />
          {/each}
          {#each row as nametag}
            <Nametag {nametag} large />
          {/each}
          {#each row as nametag}
            <Nametag {nametag} large />
          {/each}
          {#each row as nametag}
            <Nametag {nametag} large />
          {/each}
        </li>
      {/each}
    </ul>
    <div class="slot">
      <slot />
    </div>
  </div>
</Container>

<style lang="scss">
  @keyframes loop {
    0% {
      transform: translateX(0%);
    }

    100% {
      transform: translateX(-100%);
    }
  }

  .anim {
    width: 100%;
    overflow: hidden;
    padding: 1rem 0 1rem 0;
    position: relative;

    ul {
      flex-wrap: nowrap;

      li {
        animation: loop 60s linear 0s infinite alternate;

        &:nth-child(2) {
          animation-direction: alternate-reverse;
        }
      }
    }

    .slot {
      position: absolute;
      bottom: 0;
      height: 174px;
      width: 100%;

      :global(> [data-fill]) {
        width: 100%;
        height: 100%;
      }

      :global(> [data-fill='superlight']) {
        background: rgba(var(--superlight), 1);
      }

      :global(> [data-fill='system-light']) {
        background: rgba(var(--system-superlight), 0.9);
      }
    }
  }
</style>
