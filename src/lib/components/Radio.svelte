<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Icon from './Icon.svelte';

  export let group: string | number;
  export let value: string | number;
  export let label: string;
  export let labelled_by: string | undefined = undefined;
  export let icon: string | undefined = undefined;
  export let icon_filled: boolean = false;
  export let xlarge: boolean = false;

  const dispatch = createEventDispatcher();

  $: checked = group === value;
  $: dispatch('change', { checked });
</script>

<label
  class="h3"
  data-3d
  class:filled={checked}
  class:xlarge
  aria-labelledby={labelled_by}
>
  <input type="radio" bind:group {value} />
  <Icon
    filled={checked}
    icon={checked ? 'radio_button_checked' : 'radio_button_unchecked'}
  />
  <Icon {icon} filled={icon_filled} />
  <span class="nowraps">{label}</span>
  <span class="vh">
    <Icon filled icon={'radio_button_checked'} />
  </span>
</label>

<style lang="scss">
  label {
    position: relative;
    height: 32px;

    &.xlarge {
      height: 54px;
    }
  }

  input {
    appearance: auto;
    position: absolute;
    opacity: 0;
  }
</style>
