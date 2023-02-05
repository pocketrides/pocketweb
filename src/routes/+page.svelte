<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import UtilityNav from '$lib/components/UtilityNav.svelte';
  import { App } from '$lib/stores/app';

  $App.fill = 'superlight';
</script>

<svelte:head>
  <title>welcome to the experiment | pocketrides!</title>
</svelte:head>

<SiteHeader />
<Main>
  <div data-flex="v" data-gap>
    <h1 class="h2">Welcome to the experiment!</h1>
    <p>
      Pocketrides is a social media experiment. Just you, your friends, and a like
      button that earns everybody money (that's right: 500 likes is $5 bucks). It's
      $5/mo to subscribe, cuz f**k seeing ads all day every day.
    </p>
    <p class="h2">Why?!</p>
    <p>
      We have to start taking care of each other. Everybody needs a little more cash
      these days, and the planet needs a global movement if we want to do anything
      about climate change. That's why all our profits are donated: clearly the
      billionares aren't going to do anything about it.
    </p>
    <p>
      We did the math, and with a hundred million customers (just a third of
      Snapchat!) we could raise $1 billion in 10 months. That's a lot of trees
      planted, renewable energy invested in, and food given away to hungry people. To
      say nothing of the $2 billion everyone using the platform would earn.
    </p>
    <p class="h2">Let's talk about trust.</p>
    <p>
      We funded this thing ourselves. The team of two is from Arkansas, which is
      about as far away from Silicon Valley as you can get. We own 100% of the
      shares, and want nothing more than to give it all away. Every three months
      we'll give you the option: get a refund on your portion of profits, or donate
      it to change the world.
    </p>
    <p>
      Our view's pretty simple: The only thing stopping action on climate change is
      the fossil fuel lobby. We need our own money if we want to get anything done.
    </p>
  </div>
  <UtilityNav slot="utility-nav">
    <div slot="left">
      <Button
        label="Get an account!"
        icon="hail"
        system
        on:click={() => ($App.sheet_id = 'onboarding')}
      />
    </div>
  </UtilityNav>
</Main>
