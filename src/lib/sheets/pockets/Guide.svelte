<script lang="ts">
  import Container from '$lib/components/Container.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import { typewriter } from '$lib/util/transition';
  import { onDestroy } from 'svelte';

  const reasons = [
    `a birthday party.`,
    `that thing you're planning next week.`,
    `your book club.`,
    `your cat.`,
    `a group ride.`,
    `your work crew.`,
    `going to a festival.`,
    `chatting about anything.`,
    `hosting IRL events.`
  ];

  let i = Math.round(Math.random() * reasons.length - 1);
  const rand = () => {
    i++;
    i %= reasons.length;
    return reasons[i];
  };

  let reason: string | undefined = rand();
  let interval_id: any;

  const activate = () => {
    reason = rand();
    clearInterval(interval_id);
    interval_id = setInterval(newReason, 2000);
  };

  const dismiss = () => {
    clearInterval(interval_id);
  };

  const newReason = () => {
    clearInterval(interval_id);
    reason = undefined;
    setTimeout(activate, 500);
  };

  onDestroy(() => {
    clearInterval(interval_id);
  });
</script>

<Sheet
  id="pocket_guide"
  header="How Pockets work"
  icon="hail"
  on:activate={activate}
  on:dismiss={dismiss}
>
  <div data-flex="v" data-gap="1">
    <Container padded bordered rounded fill="system-superlight">
      <div class="reasons" data-flex="v" data-gap>
        <p class="h2">
          Pockets are self-contained social networks for…
          {#if reason}
            <span
              in:typewriter|local={{ duration: 250 }}
              out:typewriter|local={{ duration: 250 }}>{reason}</span
            >
          {/if}
        </p>
        <p class="h3">
          They're free for anyone to join, so you can all have a central place for
          whatever's happening.
        </p>
      </div>
    </Container>
  </div>
</Sheet>

<style lang="scss">
  .reasons {
    min-height: 90px;
  }
</style>
