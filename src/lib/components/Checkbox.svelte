<script lang="ts">
  import Icon from './Icon.svelte';

  export let checked: boolean;
  export let label: string;
  export let labelled_by: string | undefined = undefined;
  export let icon: string | undefined = undefined;
</script>

<label class="h3" data-3d class:filled={checked} aria-labelledby={labelled_by}>
  <input type="checkbox" bind:checked />
  <Icon filled={checked} icon={checked ? 'check_box' : 'check_box_outline_blank'} />
  <Icon {icon} />
  {label}
</label>

<style lang="scss">
  label {
    position: relative;
    height: 32px;
  }

  input {
    appearance: auto;
    position: absolute;
    opacity: 0;
  }
</style>
