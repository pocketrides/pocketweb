<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import { App } from '$lib/stores/app';

  $: showing_more = false;
</script>

<Container padded>
  <div data-flex="v" data-gap="1">
    <Container rounded fill="system-superlight">
      <div data-richtext>
        <h2>
          Welcome to Pocketrides! <span class="half">Here's how to get started:</span
          >
        </h2>
        <ol>
          <li>
            <Icon icon="check" /><a href="/pocket">Make your first pocket</a>
          </li>
          <li>
            <Icon icon="check" />Browse
            <a href="/worldfeed"><Icon icon="public" inline />Worldfeed</a>
          </li>
          <li>
            <Icon icon="check" /><a href="/pocket/362021519145041997">Let us know</a>
            how to improve
          </li>
        </ol>
        {#if showing_more}
          <h3>You need a subscription to:</h3>
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
          label={showing_more ? 'Show less' : 'You need a subscription to…'}
          icon={showing_more ? 'expand_less' : 'expand_more'}
          on:click={() => {
            showing_more = !showing_more;
          }}
        />
      </div>
    </Container>
    <Container>
      <div data-richtext="">
        <h3>Get Unlimited for $5.</h3>
        <p>
          Being 100% subscriber-funded means we're incentivized to treat you like a
          customer, not a user. <br /><a
            href="#why"
            on:click|preventDefault={() => {
              $App.sheet_id = 'why_pocketrides';
            }}>Read why this matters.</a
          >
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
