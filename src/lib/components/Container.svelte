<script lang="ts">
  import type { Fill } from '$lib/zod/Fill';

  export let fill: Fill | 'none' = 'none';
  export let rounded: boolean = false;
  export let rounded_lg: boolean = false;
  export let rounded_group: boolean = false;
  export let padded: boolean = true;
  export let padding_override: string | undefined = undefined;
  export let bordered: boolean = false;
  export let bottombordered: boolean = false;
  export let fullwidth: boolean = false;
  export let overflowvisible: boolean = false;
</script>

<div
  data-fill={fill}
  class:rounded
  class:rounded_lg
  class:rounded_group
  class:padded
  class:bordered
  class:bottombordered
  class:fullwidth
  class:overflowvisible
  data-padded={padding_override}
>
  <slot />
</div>

<style lang="scss">
  div {
    width: 100%;
    max-width: 640px;
    margin: auto;

    &.fullwidth {
      max-width: none;
    }
  }

  .padded {
    padding: 1rem;
  }

  .padded + :global(.padded[data-fill='none']) {
    padding-top: 0;
  }

  :global([data-padded]) {
    padding: 1rem;
  }

  :global([data-padded*='h']) {
    padding: 0;
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }

  :global([data-padded*='v']) {
    padding: 0;
    padding-top: 1rem !important;
    padding-bottom: 1rem !important;
  }

  :global([data-padded*='b']) {
    padding: 0;
    padding-bottom: 1rem !important;
  }

  :global([data-padded*='t']) {
    padding: 0;
    padding-top: 1rem !important;
  }

  :global([data-padded] + [data-padded]) {
    padding-top: 0;
  }

  .rounded {
    border-radius: 1rem;
    overflow: hidden;
  }

  .rounded_lg {
    @media (min-width: 640px) {
      border-radius: 1rem;
      overflow: hidden;
    }
  }

  :global(.rounded_group:has(+ .rounded_group)) {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

    & + .rounded_group {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }

  .bordered {
    border: 1px solid rgba(var(--dark), 0.5);

    :global([data-padded]:not(:last-child)) {
      border-bottom: 1px solid rgba(var(--dark), 0.25);
    }
  }

  .bottombordered {
    border-bottom: 1px solid rgba(var(--dark), 0.25);

    &:last-child {
      border-bottom: 0 none;
    }

    &.padded + :global(.bottombordered.padded),
    &.padded + :global(.bottombordered[data-padded]) {
      padding-top: 1rem;
    }
  }

  .overflowvisible {
    overflow: visible;
  }
</style>
