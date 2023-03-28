<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/Button.svelte';
  import ButtonRow from '$lib/components/ButtonRow.svelte';
  import UtilityNav from '$lib/components/UtilityNav.svelte';
  import { App } from '$lib/stores/app';
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
      />
      <Button
        id="new_pocket"
        icon="hail"
        label="New pocket"
        controller={button_row}
        large
      /> -->
      {:else}
        <Button
          id="sub_now"
          label="Subscribe"
          icon="favorite_border"
          primary
          controller={button_row}
          on:click={() => {
            $App.sheet_id = 'subscribe';
          }}
        />
      {/if}
    </ButtonRow>
  </div>
  <div slot="right">
    {#if feed_controls}
      <ButtonRow let:controller>
        <Button
          icon="keyboard_arrow_up"
          label="Top"
          {controller}
          on:click={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            controller.update(() => '');
          }}
        />
        <Button
          icon="keyboard_arrow_down"
          label="Bottom"
          {controller}
          on:click={() => {
            window.scrollTo({
              top:
                (document.querySelector('main')?.offsetHeight || Infinity) -
                window.innerHeight +
                // @ts-ignore
                (document.querySelector('[data-util-nav]')?.offsetHeight || 0) -
                16,
              behavior: 'smooth'
            });

            controller.update(() => '');
          }}
        />
      </ButtonRow>
    {/if}
  </div>
</UtilityNav>
