<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';

  $: showing_more = false;
</script>

<Container padded>
  <div data-flex="v" data-gap="1">
    <Container rounded bordered fill="system-superlight">
      <div data-flex="v as" data-gap>
        <h3>You&rsquo;re in free mode:</h3>
        <ul data-unstyle>
          <li>
            <Icon icon="check" /> Follow your friends
          </li>
          <li>
            <Icon icon="check" /> Make one Pocket &amp; join three
          </li>
          <li>
            <Icon icon="check" /> Get paid for likes you get
          </li>
        </ul>
        {#if showing_more}
          <h3>Get a subscription to:</h3>
          <ul data-unstyle>
            <li>
              <Icon icon="check" /> Add a bio &amp; links
            </li>
            <li>
              <Icon icon="check" /> Create unlimited Pockets
            </li>
            <li>
              <Icon icon="check" /> Publish to Worldfeed &amp; Close Friends
            </li>
          </ul>
        {/if}
        <Button
          label={showing_more ? 'Show less' : 'Get a subscription to…'}
          icon={showing_more ? 'expand_less' : 'expand_more'}
          on:click={() => {
            showing_more = !showing_more;
          }}
        />
      </div>
    </Container>
    <Container>
      <div data-flex="v" data-gap>
        <h3>Enjoying Pocketrides? Unlimited is $5/mo.</h3>
        <p>
          We're 100% subscriber-funded. No ads, no private data sales. Subscribe and
          forget, or cancel it immediately.
        </p>
      </div>
    </Container>

    <p class="small half" data-padded>
      <Icon icon="visibility_off" /> Only you can see this.
    </p>
  </div>
</Container>
