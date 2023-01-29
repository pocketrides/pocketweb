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
      <h2 class="h3">Last updated: Jaunary 28th, 2023</h2>
    </div>
    <div>
      <h2>Introduction</h2>
      <article>
        <strong>
          Pocketrides, Inc. is committed to building a safe place online.
        </strong> We treat our customers' privacy as the human right it is, and will never
        use your personal, private information in any commercial manner.
      </article>
      <article>
        We take great care to keep your Personally Identifiable Information (PII)
        secure. This is information that could directly identify you (physically in
        the real world or digitally through data analytics). All PII stored by
        Pocketrides is encrypted at rest and meets or exceeds SOC2 Type II protocols
        — the same security used by banks.
      </article>
    </div>
    <div>
      <h2>Partners</h2>
      <article>
        We take great pride in our technology partners. Please find their privacy
        policies below, in rare circumstances — such as a Terms of Use violation or
        legal, court-ordered request — your account could be subject to their
        reporting policies.
        <ul>
          <li>
            <a href="https://stripe.com/privacy" target="_blank" rel="noreferrer">
              Stripe
            </a>
          </li>
          <li>
            <a
              href="https://stytch.com/legal/privacy-policy"
              target="_blank"
              rel="noreferrer"
            >
              Stytch
            </a>
          </li>
          <li>
            <a href="https://fauna.com/privacy" target="_blank" rel="noreferrer">
              Fauna
            </a>
          </li>
        </ul>
      </article>
    </div>
  </div>
</Main>

<style lang="scss">
  article:not(:last-child) {
    margin-bottom: 1.5rem;
  }

  ul {
    margin: 1rem;
  }
</style>
