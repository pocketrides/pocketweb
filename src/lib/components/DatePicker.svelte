<script lang="ts">
  import {
    formatInputTypeDate,
    formatInputTypeDatetime,
    formatInputTypeTime
  } from '$lib/util/time-ago';
  import { nanoid } from 'nanoid';
  import Icon from './Icon.svelte';

  export let label: string | undefined = undefined;
  export let labelled_by: string | undefined = undefined;
  export let value: string;
  export let type: 'date' | 'time' | 'datetime-local' = 'date';
  export let min: any = undefined;

  export let id = nanoid();
  let input: HTMLInputElement;

  $: if (typeof min === 'string' && min !== value && value < min) value = min;
  $: valid = value && value.length > 1;
  $: display_value =
    valid && value
      ? type === 'date'
        ? formatInputTypeDate(value)
        : type === 'time'
        ? formatInputTypeTime(value)
        : type === 'datetime-local'
        ? formatInputTypeDatetime(value)
        : undefined
      : undefined;

  const showPicker = () => {
    if (input && input.showPicker) input.showPicker();
  };
</script>

<div data-flex="v as">
  {#if label}
    <label class="h3" for={id}>{label}</label>
  {/if}
  <div data-3d-container>
    {#if type === 'date'}
      <input
        {id}
        type="date"
        data-sham
        bind:value
        bind:this={input}
        on:click={showPicker}
        on:focus={showPicker}
        aria-labelledby={labelled_by}
        {min}
      />
    {:else if type === 'datetime-local'}
      <input
        {id}
        type="datetime-local"
        data-sham
        bind:value
        bind:this={input}
        on:click={showPicker}
        on:focus={showPicker}
        aria-labelledby={labelled_by}
        {min}
      />
    {:else if type === 'time'}
      <input
        {id}
        type="time"
        data-sham
        bind:value
        bind:this={input}
        on:mouseup={showPicker}
        on:focus={showPicker}
        aria-labelledby={labelled_by}
        {min}
      />
    {/if}
    <div data-3d class="h2" class:filled={valid} data-flex data-gap>
      <Icon icon={type === 'time' ? 'schedule' : 'event'} />
      {display_value || 'Pick'}
    </div>
  </div>
</div>
