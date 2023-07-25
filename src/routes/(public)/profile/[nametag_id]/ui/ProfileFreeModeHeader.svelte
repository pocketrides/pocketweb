<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import { App } from '$lib/stores/app';
  import { trackGoal } from 'fathom-client';

  $: showing_more = false;

  const getInspiredClick = () => {
    $App.sheet_id = 'pocket_inspiration';
  };
</script>

<Container padded>
  <div data-flex="v" data-gap="1">
    <Container rounded fill="system-light" bordered>
      <div data-richtext>
        <h2>
          <span class="h3 half">Welcome to Pocketrides<em>!</em></span><br />
          Here's how to get started:
        </h2>
        <ol data-flex="v" data-gap="sm">
          <li>
            <Icon icon="face_retouching_natural" /><a
              href="#inspiration"
              on:click|preventDefault={getInspiredClick}
              on:click={() => {
                trackGoal('QZRBSJMD', 1);
              }}>Get inspired</a
            >
          </li>
          <li>
            <Icon icon="hail" /><a
              href="/pocket"
              on:click={() => {
                trackGoal('RHDXGRUR', 1);
              }}>Make a Pocket</a
            >
          </li>
          <li>
            <Icon icon="build" /><a href="/pocket/362021519145041997"
              >Help us improve</a
            >
          </li>
        </ol>
        {#if showing_more}
          <h3>Get Unlimited to:</h3>
          <ul data-flex="v" data-gap="sm">
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
    <Container padded={false}>
      <div data-flex="v as" data-gap>
        <h3 class="h2">
          <Icon icon="favorite" />
          Unlimited is $1.99/mo.
        </h3>
        <p>
          <strong>Your privacy is never for sale.</strong> Pocketrides is 100% subscriber-funded.
          No subscription required, you'll never lose access to what you create.
        </p>
        <Button
          id="sub_now"
          label="Get Unlimited"
          icon="favorite"
          icon_filled
          primary
          large
          on:click={() => {
            $App.sheet_id = 'subscribe';
          }}
        />
        <p>
          Read more:<br /><a
            href="#why"
            class="h3"
            on:click|preventDefault={() => {
              $App.sheet_id = 'why_pocketrides';
            }}>Why Pocketrides?</a
          >
        </p>
      </div>
    </Container>

    <p class="small half">
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
