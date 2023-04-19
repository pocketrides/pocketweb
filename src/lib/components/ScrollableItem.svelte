<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import type { Fill } from '$lib/zod/Fill';
  import { createEventDispatcher, onMount } from 'svelte';

  export let id: string | undefined = undefined;
  export let root: HTMLDivElement | undefined = undefined;
  export let ariaCurrent: boolean | undefined = undefined;
  export let fill: Fill = 'system-light';

  let init = false;
  let io: IntersectionObserver;

  const dispatch = createEventDispatcher();

  onMount(() => {
    if (!root) return;

    io = new IntersectionObserver(
      (entries) => {
        if (!init) {
          init = true;
          return;
        }

        const entry = entries[0];

        if (entry.intersectionRatio === 1) {
          dispatch('active', { id });
        }
      },
      {
        root: root.parentElement,
        threshold: [0, 1]
      }
    );

    return () => {
      io.unobserve(root as Element);
    };
  });

  afterNavigate(() => {
    io.observe(root as Element);
  });
</script>

<div
  data-scrollable-item
  data-fill={fill}
  bind:this={root}
  aria-current={ariaCurrent ? 'page' : undefined}
>
  <slot />
</div>

<style>
  div {
    width: 100%;
    scroll-snap-align: start;
    flex: 1 0 100%;
    position: relative;
  }
</style>
