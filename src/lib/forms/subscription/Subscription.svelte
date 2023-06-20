<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import { createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';
  import { trackGoal } from 'fathom-client';
  import { page } from '$app/stores';
  import { App } from '$lib/stores/app';
  import Icon from '$lib/components/Icon.svelte';

  const dispatch = createEventDispatcher();

  const loading = writable(false);

  const subscribeClick = () => {
    $loading = true;
    trackGoal('ZOOQK7CR', 1);
  };

  const noThanksClick = () => {
    dispatch('complete');
  };
</script>

<div data-flex="v" data-gap="1">
  <div data-flex="v" data-gap="1">
    <Container rounded fill="system-superlight">
      <div data-flex="v as" data-gap>
        <h2>Try it free all month.</h2>
        <p>
          Use a social network built for authentic community: no ads, no data sales,
          and no greedy profit motive.
        </p>
      </div>
    </Container>
    <Container>
      <div data-flex="v as" data-gap>
        <h2>Profits for purpose.</h2>
        <p>
          100% of our profits are for climate action. We can all have meaningful
          impact with a little <a class="h3" href="/pocket/362022120043053129">
            <Icon icon="hail" inline />Pocketchange</a
          >.
        </p>
      </div>
    </Container>
    <Container>
      <div data-flex="v as" data-gap>
        <h2>Build community.</h2>
        <p>
          Invite your friends to try it with you, or build a new community on the
          Worldfeed.
        </p>
      </div>
    </Container>
  </div>
  {#if $page.data.my_nametag}
    <div data-ph data-flex="v cc" data-gap="1">
      <Button
        label={$loading ? 'One sec…' : 'Start 30-day trial'}
        disabled={$loading}
        href="/_/stripe/pay"
        on:click={subscribeClick}
        primary
        xlarge
      />
      <Button label="No thanks!" on:click={noThanksClick} />
    </div>
  {:else}
    <div data-flex="v cc">
      <Button label="Got it!" on:click={noThanksClick} />
    </div>
  {/if}
</div>
