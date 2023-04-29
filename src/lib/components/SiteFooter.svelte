<script lang="ts">
  import { page } from '$app/stores';
  import { App } from '$lib/stores/app';
  import Container from './Container.svelte';

  const year = new Date().getFullYear();
</script>

<footer data-fill="dark">
  <Container>
    <div data-flex="v" data-gap="1" data-padded="v">
      <div data-flex="v" data-gap>
        <h2 data-flex="ac" data-gap>
          <img
            src={`/pocketrides-${
              $page.data.page_theme ?? $App.theme ?? 'system'
            }.png`}
            alt="pocket logo"
            aria-hidden="true"
          />
          <span class="">Pocketrides!</span>
        </h2>
        <p class="h3 half" data-flex="v">
          <span class="thin">Plan anything.</span>
          <span class="thin">Share everything.</span>
          <span>Be safe online.</span>
        </p>
      </div>
      <div data-flex="v" data-gap>
        <div class="h3 half"><a href="/unlimited">For Organizations</a></div>
        <div class="h3 half"><a href="/privacy-policy">Privacy Policy</a></div>
        <div class="h3 half"><a href="/terms-of-use">Terms of Use</a></div>
        <div class="h3 half"><a href="/help">Contact us</a></div>
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

  img {
    width: 32px;
    height: 32px;
  }

  a:hover,
  a:active {
    color: rgb(var(--light));
  }
</style>
