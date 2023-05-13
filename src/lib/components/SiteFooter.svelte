<script lang="ts">
  import Container from './Container.svelte';
  import Icon from './Icon.svelte';
  import Logo from './Logo.svelte';

  const year = new Date().getFullYear();
</script>

<footer data-fill="dark">
  <Container>
    <div data-flex="v" data-gap="1" data-padded="v">
      <div data-flex="v as" data-gap>
        <Logo />
        <h2 data-gap>
          <a
            href="/profile/360661340419784777"
            data-unstyle
            aria-label="Follow us on Pocketrides"
            data-flex="v ac"
          >
            <span>Pocketrides<em>!</em></span>
            <span class="small half"
              >View our profile <Icon icon="arrow_right" /></span
            >
          </a>
        </h2>
      </div>

      <div data-flex="v" data-gap>
        <div class="h3 half"><a href="/unlimited">For Organizations</a></div>
        <div class="h3 half"><a href="/help">Get help</a></div>
        <div class="h3 half"><a href="/help">Contact us</a></div>
        <div class="h3 half small" data-ph>
          <a href="/help">About Pocketrides</a>
        </div>
        <div class="h3 half small">
          <a href="/pocket/364647123794264137">Transparency Report</a>
        </div>
        <div class="h3 half small">
          <a class="small" href="/privacy-policy">Privacy Policy</a>
        </div>
        <div class="h3 half small">
          <a href="/terms-of-use">Terms of Use</a>
        </div>
        <p class="half">
          <small>&copy; {year} Pocketrides, Inc.</small>
        </p>
      </div>
    </div>
  </Container>
</footer>

<style lang="scss">
  footer {
    width: 100%;
    background: rgb(var(--dark));
    color: rgb(var(--light));

    padding-bottom: env(safe-area-inset-bottom);
  }

  h2 {
    color: rgba(var(--light), 0.75);
  }

  .half {
    color: rgba(var(--light), 0.5);
  }

  a:hover,
  a:hover .half,
  a:active,
  a:active .half {
    color: rgb(var(--light));
  }

  .half {
    opacity: 0.85;
  }
</style>
