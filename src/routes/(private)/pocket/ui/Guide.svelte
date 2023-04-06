<script lang="ts">
  import Container from '$lib/components/Container.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import { THEME_NAMES, THEME_VALUES } from '$lib/zod/Theme';
  import { onDestroy } from 'svelte';
  import Name from './form/Name.svelte';
  import { writable } from 'svelte/store';

  const store = writable<{ name_html: string; name_raw: string }>({
    name_html: '',
    name_raw: ''
  });

  const reasons = [
    `Jeremy's Birthday Party!`,
    `💍<br>Christian + Shannon`,
    `March Book Club`,
    `😻<br>Milky & Phoebe`,
    `Tuesday<br>Night<br>Thunder`,
    `Trip to SF`,
    `Format Fest Crew`
  ];

  let i = Math.round(Math.random() * reasons.length - 1);
  let ti = Math.round(Math.random() * THEME_NAMES.length - 1);

  $: theme = THEME_VALUES[ti];

  const rand = () => {
    i++;
    ti++;
    i %= reasons.length;
    ti %= THEME_NAMES.length;
    $store.name_html = reasons[i];
    return reasons[i];
  };

  let reason: string | undefined = rand();
  let interval_id: any;

  const activate = () => {
    reason = rand();
    clearInterval(interval_id);
    interval_id = setInterval(newReason, 3000);
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

<div style="display: contents" data-theme={theme}>
  <Sheet
    id="pocket_guide"
    header="How Pockets work"
    fill="dark"
    header_fill="dark"
    on:activate={activate}
    on:dismiss={dismiss}
  >
    <div data-flex="v" data-gap="1">
      <div data-mock>
        <Name {store} />
      </div>
      <Container padded bordered rounded fill="system-superlight">
        <p class="h2">Pockets are great for IRL.</p>
        <p>
          Get out of DMs or group chats and into a central place for planning stuff -
          and sharing the recap. Think of a pocket like you're making a group memory
          in your own private social network.
        </p>
      </Container>
      <Container padded>
        <p class="h2">Pockets are free to join.</p>
        <p>
          Everyone deserves a great, centralized place with the flexibility to plan &
          organize whatever's happening.
        </p>
      </Container>
      <Container padded>
        <p class="h2">So many other uses, too.</p>
        <p>
          Have a niche only some of your followers care about? Put your Pocket in
          broadcast mode and share whatever you want - people who care can follow, or
          not.
        </p>
      </Container>
    </div>
  </Sheet>
</div>

<style lang="scss">
  [data-mock] :global(label) {
    opacity: 0.5;
  }

  [data-mock] :global(.wrapper) {
    min-height: 11rem;
  }
</style>
