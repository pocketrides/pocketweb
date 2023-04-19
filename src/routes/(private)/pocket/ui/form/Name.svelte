<script lang="ts">
  import { dompurify_config_only_text } from '$lib/util/dompurify';
  import { onMount } from 'svelte';
  import type { Writable } from 'svelte/store';

  export let store: Writable<{ name_html: string; name_raw: string }>;

  let placeholder = `Start typing…`;
  let focused: boolean = false;

  let sanitize: DOMPurify.DOMPurifyI['sanitize'];

  onMount(async () => {
    const lib = await import('dompurify');

    sanitize = lib.default.sanitize;
  });

  const change = () => {
    if (sanitize) {
      $store.name_html = sanitize(
        $store.name_raw.replace(/\n/g, `<br>`).replace(/<br>$/g, '<br>&nbsp;'),
        dompurify_config_only_text
      ) as string;
    }
  };

  const focus = () => (focused = true);
  const blur = () => (focused = false);
</script>

<div data-flex="v">
  <h2>
    <label for="name">What's happening?</label>
  </h2>
  <div class="wrapper" class:focused class:blurred={!focused}>
    <textarea
      id="name"
      class="jumbo"
      data-sham
      bind:value={$store.name_raw}
      {placeholder}
      on:focus={focus}
      on:blur={blur}
      on:input={change}
    />
    <div class="jumbo" class:half={$store.name_html === ''}>
      {@html $store.name_html || placeholder}
    </div>
  </div>
</div>

<style lang="scss">
  .jumbo {
    max-width: 90%;
  }

  .wrapper {
    min-height: 8rem;
  }

  textarea {
    color: rgb(var(--allwhite));
    opacity: 1;

    &::placeholder {
      color: rgba(var(--allwhite), 0.5);
    }
  }

  .focused div {
    opacity: 0;
  }

  .blurred textarea {
    opacity: 0;
  }
</style>
