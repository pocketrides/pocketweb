<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/Button.svelte';
  import ButtonRow from '$lib/components/ButtonRow.svelte';
  import UtilityNav from '$lib/components/UtilityNav.svelte';
  import { App } from '$lib/stores/app';
  import { trackGoal } from 'fathom-client';
  import { writable } from 'svelte/store';

  export let feed_controls = false;

  const button_row = writable(
    $page.data.my_nametag?.stripe?.has_sub ? 'new_post' : 'sub_now'
  );
</script>

<UtilityNav>
  <div slot="left">
    <ButtonRow>
      {#if $page.data.my_nametag?.stripe?.has_sub}
        <Button
          id="new_post"
          icon="signpost"
          label="New post"
          primary
          controller={button_row}
          href="/post"
        />
        <!-- <Button
          id="new_status"
          icon="airline_stops"
          label="New status"
          controller={button_row}
          large
        /> -->
        <Button
          id="new_pocket"
          icon="hail"
          label="New pocket"
          controller={button_row}
          large
          href="/pocket"
          on:click={() => {
            trackGoal('RHDXGRUR', 1);
          }}
        />
      {:else}
        <Button
          id="sub_now"
          label="Get Unlimited"
          icon="favorite"
          icon_filled
          primary
          controller={button_row}
          on:click={() => {
            $App.sheet_id = 'subscribe';
          }}
        />
        <Button
          id="new_pocket"
          icon="hail"
          label="New pocket"
          controller={button_row}
          large
          href="/pocket"
          on:click={() => {
            trackGoal('RHDXGRUR', 1);
          }}
        />
      {/if}
    </ButtonRow>
  </div>
  <div slot="right">
    {#if feed_controls}
      <ButtonRow>
        <Button
          icon="keyboard_arrow_up"
          label="Top"
          controller={button_row}
          on:click={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            button_row.update(() => '');
          }}
        />
        <Button
          icon="keyboard_arrow_down"
          label="Bottom"
          controller={button_row}
          on:click={() => {
            const main = document.querySelector('main'),
              util_nav = document.querySelector('[data-util-nav]');

            if (!main || !util_nav) return;

            window.scrollTo({
              top: main.offsetTop + main.offsetHeight - 16 - window.innerHeight,
              behavior: 'smooth'
            });

            button_row.update(() => '');
          }}
        />
      </ButtonRow>
    {/if}
  </div>
</UtilityNav>
