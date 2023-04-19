<script lang="ts">
  import {
    dateForDate,
    dateForDatetime,
    formatDate,
    getTimeAgo
  } from '$lib/util/time-ago';
  import type { DraftPocketDetails } from '$lib/zod/Pocket';
  import Icon from '../Icon.svelte';

  export let details: DraftPocketDetails;
  export let h2: boolean = true;
  export let h3: boolean = false;
  export let summary: boolean = false;

  $: multiday = details.start_date !== details.end_date;
  $: start_datetime = details.start_datetime
    ? dateForDatetime(details.start_datetime)
    : undefined;
  $: end_datetime = details.end_datetime
    ? dateForDatetime(details.end_datetime)
    : undefined;
  $: start_date = details.start_date ? dateForDate(details.start_date) : undefined;
  $: end_date = details.end_date ? dateForDate(details.end_date) : undefined;
</script>

<div class:h2 class:h3 data-flex="v" data-gap>
  {#if details.whenever}
    <p class:nowraps={summary}>
      {#if !summary}
        <Icon icon="event" multiline />
      {/if}
      {details.whenever_reason || 'Whenever'}
    </p>
  {:else if details.all_day}
    {#if start_date && end_date}
      {#if multiday}
        <div>
          <p class:nowraps={summary}>
            {#if !summary}
              <Icon icon="event" />
            {/if}
            Starts {formatDate(start_date, 'long')}
          </p>
          {#if !summary}
            <p class="half indent">
              Ends {formatDate(end_date, 'long')}
            </p>
          {/if}
        </div>
      {:else}
        <div>
          <p class:nowraps={summary}>
            {#if !summary}
              <Icon icon="event" />
            {/if}
            All day, {formatDate(start_date, 'long')}
          </p>
        </div>
      {/if}
    {/if}
  {:else if start_datetime}
    {#if end_datetime}
      {#if multiday}
        <div>
          <p class:nowraps={summary}>
            {#if !summary}
              <Icon icon="event" />
            {/if}
            Starts {formatDate(start_datetime, 'long', 'short')}
          </p>
          {#if !summary}
            <p class="indent">
              Ends {formatDate(end_datetime, 'long', 'short')}
            </p>
          {/if}
        </div>
      {:else}
        <div>
          <p class:nowraps={summary}>
            {#if !summary}
              <Icon icon="event" />
            {/if}
            {formatDate(start_datetime, 'full')}
          </p>
          {#if !summary}
            <p class="indent">
              {formatDate(start_datetime, undefined, 'short')} to
              {formatDate(end_datetime, undefined, 'short')}
            </p>
            <p class="half indent">
              {getTimeAgo(start_datetime)}
            </p>
          {/if}
        </div>
      {/if}
    {/if}
  {/if}
</div>

<style lang="scss">
  .indent {
    padding-left: 1.5em;
  }
</style>
