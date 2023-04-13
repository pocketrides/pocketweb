<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Gallery from '$lib/components/Gallery.svelte';
  import Logo from '$lib/components/Logo.svelte';
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import UtilityNav from '$lib/components/UtilityNav.svelte';
  import { App } from '$lib/stores/app';
  import type { CloudinaryPhoto } from '$lib/zod/CloudinaryPhoto';
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';

  $: $App.theme = 'system';
  $: $App.fill = 'system-superlight';

  $: ready = false;

  onMount(() => {
    ready = true;
  });

  const pockets: CloudinaryPhoto[] = [
    {
      version: 1681421229,
      public_id: 'Homepage/pockets2_qaxya0.png'
    },
    {
      version: 1681421229,
      public_id: 'Homepage/pockets3_flv6dd.png'
    },
    {
      version: 1681421229,
      public_id: 'Homepage/pockets1_bolfuy.png'
    },
    {
      version: 1681421230,
      public_id:
        'Homepage/Simulator_Screenshot_-_iPhone_14_Pro_Max_-_2023-04-13_at_16.16.21_w8o9kd.png'
    }
  ];

  const posts: CloudinaryPhoto[] = [
    {
      version: 1681421230,
      public_id:
        'Homepage/Simulator_Screenshot_-_iPhone_14_Pro_Max_-_2023-04-13_at_16.19.47_nd0z8w.png'
    },
    {
      version: 1681424398,
      public_id:
        'Homepage/Simulator_Screenshot_-_iPhone_14_Pro_Max_-_2023-04-13_at_17.18.20_w6o1qd.png'
    },
    {
      version: 1681421230,
      public_id:
        'Homepage/Simulator_Screenshot_-_iPhone_14_Pro_Max_-_2023-04-13_at_16.17.59_ljnn1a.png'
    }
  ];

  const get_paid: CloudinaryPhoto[] = [
    {
      version: 1681421230,
      public_id:
        'Homepage/Simulator_Screenshot_-_iPhone_14_Pro_Max_-_2023-04-13_at_16.17.59_ljnn1a.png'
    },
    {
      version: 1681421230,
      public_id:
        'Homepage/Simulator_Screenshot_-_iPhone_14_Pro_Max_-_2023-04-13_at_16.21.29_rigqp2.png'
    },
    {
      version: 1681425363,
      public_id:
        'Homepage/Simulator_Screenshot_-_iPhone_14_Pro_Max_-_2023-04-13_at_17.35.05_nkzvbw.png'
    }
  ];
</script>

<svelte:head>
  <title>welcome welcome! it's pocketrides!</title>
</svelte:head>

<SiteHeader>
  <div slot="right">
    <Button label="Sign in" on:click={() => ($App.sheet_id = 'onboarding')} />
  </div>
</SiteHeader>
<Main fullheight padded={false}>
  <div data-flex="v" data-gap="1" class="home">
    <Container>
      <Container rounded fill="system-superlight">
        <div class="card" data-flex="ae">
          <div data-flex="v">
            <h1 class="jumbo" data-flex="v">
              {#if ready}
                <span in:fly|local={{ y: 50, duration: 550 }}>
                  <Logo />
                </span>
                <span in:fly|local={{ y: 50, duration: 550, delay: 75 }}>
                  The place
                </span>
                <span in:fly|local={{ y: 50, duration: 550, delay: 150 }}>
                  to be you again.
                </span>
              {/if}
            </h1>
          </div>
        </div>
      </Container>
    </Container>
    <Container>
      <h2>
        A social network for the next generation:
        <span class="half">
          plan anything, share everything, get paid along the way.
        </span>
      </h2>
      <h2>Welcome to Pocketrides<em>!</em></h2>
    </Container>
    <Container padded={false} fill="system-superlight">
      <Gallery contain square={false} photos={pockets} />
    </Container>
    <Container>
      <h2>
        Plan anything in a Pocket.
        <span class="half">
          Way better than DMs or a group chat. It's a central place for planning
          anything - and sharing the recap.
        </span>
      </h2>
    </Container>
    <Container padded={false} fill="system-superlight">
      <Gallery contain square={false} photos={posts} />
    </Container>
    <Container>
      <h2>
        Share everything in a Post.
        <span class="half">
          Stop typing in tiny text boxes. Enjoy a composer that's as flexible as you
          need: share links, photos, or write something longer.
        </span>
      </h2>
    </Container>
    <Container padded={false} fill="system-superlight">
      <Gallery contain square={false} photos={get_paid} />
    </Container>
    <Container>
      <h2>
        Get paid along the way.
        <span class="half">
          Look, it's hard to make good content. On Pocketrides, each like you get
          (and give) is worth a cent. That means 500 likes is $5.00.
        </span>
      </h2>
    </Container>
    <Container>
      <Container padded rounded fill="system-superlight">
        <div data-flex="v as" data-gap>
          <div>
            <h2>Coming soon: Pocketchange</h2>
            <h2 class="half">Let's raise a billion dollars for climate action.</h2>
          </div>
          <Button
            label="Read the thesis"
            href="https://pocketrides.com/post/360661931087888461"
          />
        </div>
      </Container>
    </Container>
  </div>
  <UtilityNav slot="utility-nav">
    <div slot="left">
      <Button
        label="Get free account"
        icon="hail"
        system
        on:click={() => ($App.sheet_id = 'onboarding')}
      />
    </div>
  </UtilityNav>
</Main>

<style lang="scss">
  .home {
    h1,
    h2 {
      color: rgb(var(--dark));
    }

    .half {
      color: rgba(var(--dark), 0.75);
    }
  }

  .card {
    aspect-ratio: 9/16;
    max-height: 420px;
    width: 100%;
    position: relative;

    > *:not(img) {
      position: relative;
      z-index: 1;
    }
  }
</style>
