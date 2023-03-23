<script lang="ts">
  import Icon from './Icon.svelte';

  export let checked: boolean;
  export let label: string;
  export let labelled_by: string | undefined = undefined;
  export let icon: string | undefined = undefined;
  export let xlarge: boolean = false;
  export let disabled: boolean = false;
</script>

<label
  class="h3"
  data-3d
  class:filled={checked}
  class:xlarge
  aria-labelledby={labelled_by}
  aria-disabled={disabled}
>
  <input type="checkbox" bind:checked {disabled} on:change />
  {#if checked}
    <Icon filled={checked} icon={'check_box'} />
  {:else}
    <Icon icon={'check_box_outline_blank'} />
    <span class="vh">
      <Icon filled icon={'check_box'} />
    </span>
  {/if}
  <Icon {icon} />
  {label}
</label>

<style lang="scss">
  label {
    position: relative;
    height: 32px;
    user-select: none;

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
