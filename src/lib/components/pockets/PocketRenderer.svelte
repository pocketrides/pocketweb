<script lang="ts">
  import type { Fill } from '$lib/zod/Fill';
  import type { PocketEnabledDetails } from '$lib/zod/Pocket';

  export let details_enabled: PocketEnabledDetails;
  export let always_show_slot = false;
  export let default_fill: Fill | 'none' = 'none';

  $: has_section2 = details_enabled.length;
  $: has_section3 = details_enabled.length > 2;

  let section1_fill = 'dark';
  let section2_fill = 'base';
  let section3_fill = 'superlight';
</script>

<div data-fill={has_section2 ? section2_fill : default_fill}>
  <div data-fill={section1_fill} data-rounded>
    <slot name="name" />
  </div>
</div>
{#if has_section2}
  <div data-fill={has_section3 ? section3_fill : default_fill}>
    <div data-fill={section2_fill} data-rounded>
      {#each details_enabled as detail, i (detail)}
        {#if i < 2}
          {#if detail === 'time'}
            <slot name="time" />
          {/if}
          {#if detail === 'place'}
            <slot name="place" />
          {/if}
          {#if detail === 'links'}
            <slot name="links" />
          {/if}
          {#if detail === 'desc'}
            <slot name="desc" />
          {/if}
        {/if}
      {/each}
    </div>
  </div>
{/if}
{#if has_section3}
  <div data-fill={section3_fill} data-rounded>
    {#each details_enabled as detail, i (detail)}
      {#if i >= 2}
        {#if detail === 'time'}
          <slot name="time" />
        {/if}
        {#if detail === 'place'}
          <slot name="place" />
        {/if}
        {#if detail === 'links'}
          <slot name="links" />
        {/if}
        {#if detail === 'desc'}
          <slot name="desc" />
        {/if}
      {/if}
    {/each}
  </div>
{/if}
{#if details_enabled.length < 4 || always_show_slot === true}
  <slot />
{/if}
