<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Checkbox from '$lib/components/Checkbox.svelte';
  import Container from '$lib/components/Container.svelte';
  import DatePicker from '$lib/components/DatePicker.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Row from '$lib/components/Row.svelte';
  import type { DraftPocket } from '$lib/zod/Pocket';
  import type { Writable } from 'svelte/store';
  import { z } from 'zod';
  import { page_label } from '../store';
  import { getDatetimeStringForNow } from '$lib/util/time-ago';

  export let page_controller: Writable<DraftPocket>;

  let now = getDatetimeStringForNow();
  let start_date = $page_controller.details.start_date || '';
  let start_datetime = $page_controller.details.start_datetime || now;
  let end_date = $page_controller.details.end_date || '';
  let end_datetime = $page_controller.details.end_datetime || now;
  let all_day = $page_controller.details.all_day || false;
  let whenever = $page_controller.details.whenever || false;
  let whenever_reason = $page_controller.details.whenever_reason || '';

  $: start_date =
    !all_day && start_datetime !== '' ? start_datetime.substring(0, 10) : start_date;
  $: end_date =
    !all_day && end_datetime !== '' ? end_datetime.substring(0, 10) : end_date;
  $: end_datetime =
    start_datetime !== '' && end_datetime === '' ? start_datetime : end_datetime;

  $: $page_controller.details.start_date = start_date;
  $: $page_controller.details.start_datetime = start_datetime;
  $: $page_controller.details.end_date = end_date;
  $: $page_controller.details.end_datetime = end_datetime;
  $: $page_controller.details.all_day = all_day;
  $: $page_controller.details.whenever = whenever;
  $: $page_controller.details.whenever_reason = whenever_reason;
  $: whenever_reason_valid = z.string().max(44).safeParse(whenever_reason).success;

  const deleteClick = () => {
    page_controller.update((prev) => {
      prev.details_enabled.splice(prev.details_enabled.indexOf('time'), 1);
      delete prev.details.start_date;
      delete prev.details.end_date;
      delete prev.details.start_datetime;
      delete prev.details.end_datetime;
      delete prev.details.all_day;
      delete prev.details.whenever;
      delete prev.details.whenever_reason;
      return prev;
    });
  };

  const handleAllDayChange = () => {
    if (all_day === false) {
      // it will be all day now, so copy over start datetime's date if there is one
      const [_start_date] = start_datetime.split('T');
      const [_end_date] = end_datetime.split('T');

      if (_start_date !== '') {
        start_date = _start_date;
        // start_datetime = '';
      }

      if (_end_date !== '') {
        end_date = _end_date;
        // end_datetime = '';
      }

      all_day = true;
    } else {
      // it's not going to be all day anyore, so restore what you know about the date
      if (start_date !== '' && start_datetime === '') {
        const now = new Date();
        const hh = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
        const mm = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();

        start_datetime = `${start_date}T${hh}:${mm}`;
      }

      if (end_date !== '' && end_datetime === '') {
        const now = new Date();
        const hh = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
        const mm = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();

        end_datetime = `${end_date}T${hh}:${mm}`;
      }

      all_day = false;
    }
  };

  const handleWheneverChange = () => {
    whenever = !whenever;
  };
</script>

<Container bottombordered>
  <div data-flex="v" data-gap>
    <Row>
      <h2 slot="left">
        <Icon icon="event" />
        Date
      </h2>
      <Button
        slot="right"
        icon="delete"
        label="Remove"
        on:click={deleteClick}
        controller={page_label}
      />
    </Row>
    {#if whenever}
      <div data-flex="v">
        <label for="whenever_reason" class="h3"> When are you thinking? </label>
        <input
          id="whenever_reason"
          name="whenever_reason"
          bind:value={whenever_reason}
          data-3d
          class="h3"
          class:filled={whenever_reason_valid && whenever_reason.length > 0}
          placeholder="Whenever"
        />
        {#if whenever_reason_valid === false}
          <div data-flex="as">
            <label for="whenever_reason" data-error>Keep it brief.</label>
          </div>
        {/if}
      </div>
    {:else}
      <div data-flex="ac" data-gap>
        <h2>
          <label for="starts">Starts:</label>
        </h2>
        {#if all_day}
          <DatePicker bind:value={start_date} id="starts" />
        {:else}
          <DatePicker
            bind:value={start_datetime}
            type="datetime-local"
            id="starts"
          />
        {/if}
      </div>
      <div data-flex="ac" data-gap>
        <h2>
          <label for="ends">Ends:</label>
        </h2>
        {#if all_day}
          <DatePicker bind:value={end_date} bind:min={start_date} id="ends" />
        {:else}
          <DatePicker
            type="datetime-local"
            id="ends"
            bind:value={end_datetime}
            bind:min={start_datetime}
          />
        {/if}
      </div>
    {/if}
    <div data-flex data-gap>
      {#if !whenever}
        <Checkbox checked={all_day} label="All day" on:change={handleAllDayChange} />
      {/if}
      <Checkbox
        checked={whenever}
        label="Whenever"
        on:change={handleWheneverChange}
      />
    </div>
  </div>
</Container>

<style lang="scss">
  h2 {
    margin-right: auto;
  }
</style>
