<script lang="ts">
  import Container from './Container.svelte';

  const year = new Date().getFullYear();
</script>

<footer>
  <Container>
    <div data-flex="v" data-gap>
      <p class="h1">
        <span class="half">
          Plan anything.<br />
          Share everything.<br />
        </span>
        Be safe online.
      </p>
      <p class="half">
        <a href="/privacy-policy">Privacy Policy</a> •
        <a href="/terms-of-use">Terms of Use</a>
      </p>
      <p class="half">
        <small>&copy; {year} Pocketrides, Inc.</small>
      </p>
    </div>
  </Container>
</footer>

<style lang="scss">
  footer {
    width: 100%;
    background: rgb(var(--dark));
    color: rgb(var(--light));
  }

  .half {
    color: rgba(var(--light), 0.5);

    a:hover,
    a:active {
      color: rgb(var(--light));
    }
  }
</style>
