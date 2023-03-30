<script lang="ts">
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import { App } from '$lib/stores/app';

  $App.fill = 'superlight';
</script>

<SiteHeader />
<Main>
  <div data-flex="v" data-gap>
    <div>
      <h1 class="jumbo">Privacy Policy</h1>
      <h2 class="h3">Last updated: March 30th, 2023</h2>
    </div>
    <article data-richtext>
      <h2>Introduction</h2>
      <p>
        <strong>
          Pocketrides, Inc. is committed to building a safe place online.
        </strong> We treat our customers' privacy as the human right it is, and will never
        use your personal, private information in any commercial manner.
      </p>
      <p>
        We take great care to keep your Personally Identifiable Information (PII)
        secure. This is information that could directly identify you (physically in
        the real world or digitally through data analytics). All PII stored by
        Pocketrides is encrypted at rest and meets or exceeds SOC2 Type II protocols
        — the same security used by banks.
      </p>
    </article>
  </div>
</Main>
