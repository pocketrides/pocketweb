<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import { App } from '$lib/stores/app';

  $: showing_more = false;

  const getInspiredClick = () => {
    $App.sheet_id = 'pocket_inspiration';
  };
</script>

<Container padded>
  <div data-flex="v" data-gap="1">
    <Container rounded fill="system-superlight">
      <div data-richtext>
        <h2>
          Welcome to Pocketrides<em>!</em>
          <span class="half">Here's how to get started:</span>
        </h2>
        <ol>
          <li>
            <Icon icon="face_retouching_natural" /><a
              href="#inspiration"
              on:click|preventDefault={getInspiredClick}>Get inspired</a
            >
          </li>
          <li>
            <Icon icon="hail" /><a href="/pocket">Make a Pocket</a>
          </li>
          <li>
            <Icon icon="build" /><a href="/pocket/362021519145041997"
              >Help us improve</a
            >
          </li>
        </ol>
        {#if showing_more}
          <h3>Get Unlimited to:</h3>
          <ul>
            <li>
              <Icon icon="lock" /> Add a bio &amp; links
              <span class="half">(coming soon!)</span>
            </li>
            <li>
              <Icon icon="lock" /> Create unlimited Pockets
            </li>
            <li>
              <Icon icon="lock" /> Post to Worldfeed
            </li>
            <li>
              <Icon icon="lock" /> Post to Close Friends
            </li>
          </ul>
        {/if}
        <Button
          label={showing_more ? 'Show less' : 'Get Unlimited to…'}
          icon={showing_more ? 'expand_less' : 'expand_more'}
          on:click={() => {
            showing_more = !showing_more;
          }}
        />
      </div>
    </Container>
    <Container>
      <div data-richtext="">
        <h3>
          <Icon icon="favorite" />
          Try Unlimited for 30 days.
        </h3>
        <p>
          Sustainable pricing, split with creators. Your privacy is never for sale.
          Pause anytime, you'll never lose access.<br /><a
            href="#why"
            on:click|preventDefault={() => {
              $App.sheet_id = 'why_pocketrides';
            }}>Read more</a
          >.
        </p>
      </div>
    </Container>

    <p class="small half" data-padded>
      <Icon icon="visibility_off" /> Only you can see this.
    </p>
  </div>
</Container>

<style lang="scss">
  [data-richtext] {
    ol,
    ul {
      margin-top: 1rem;
      margin-left: 0rem;
    }
  }
</style>
