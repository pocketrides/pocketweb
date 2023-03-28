<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Main from '$lib/components/Main.svelte';
  import Post from '$lib/components/Post.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import UtilityNav from '$lib/components/UtilityNav.svelte';
  import { App } from '$lib/stores/app';

  $App.fill = 'superlight';
</script>

<svelte:head>
  <title>welcome to the experiment | pocketrides!</title>
</svelte:head>

<SiteHeader />
<Main fullheight>
  <!-- <div data-flex="v" data-gap="1">
    <HomepageContainer>
      <h1 class="h2">Social media done differently.</h1>
      <div>
        <Button label="Read the thesis" />
      </div>
    </HomepageContainer>
    <HomepageContainer>
      <h2>Give a cent. <span class="thin">Get a cent.</span></h2>
      <p>Everybody earns money on Pocketrides. 500 likes is $5.00.</p>
    </HomepageContainer>
    <HomepageContainer>
      <h2>Climate action right now.</h2>
      <p>
        Every quarter, we'll ask you what to do with our profits: keep it, or donate
        it.
      </p>
    </HomepageContainer>
    <HomepageContainer>
      <h2>More on the way!</h2>
      <p>
        We're busy adding more features: Worldfeed for your city, Pockets for your
        group, and Current Status for your friends.
      </p>
    </HomepageContainer>
  </div> -->
  <Post post_id="360300421885984845" wrapper_mode let:post>
    {#each post.contents as pc}
      {@html pc.content}
    {/each}
  </Post>

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
</style>
