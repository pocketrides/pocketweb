<script lang="ts">
  import Sheet from '$lib/components/Sheet.svelte';
  import { THEME_NAMES, THEME_VALUES } from '$lib/zod/Theme';
  import { onDestroy } from 'svelte';
  import Name from './form/Name.svelte';
  import { writable } from 'svelte/store';
  import PocketIntro from '$lib/components/pockets/PocketIntro.svelte';

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
    `🏕️<br>Red Rocks Camping`
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
    icon="hail"
    fill="dark"
    header_fill="dark"
    on:activate={activate}
    on:dismiss={dismiss}
  >
    <div data-flex="v" data-gap="1">
      <div data-mock>
        <Name {store} />
      </div>
      <PocketIntro />
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
