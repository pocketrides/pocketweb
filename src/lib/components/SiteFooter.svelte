<script lang="ts">
  import Container from './Container.svelte';

  const year = new Date().getFullYear();
</script>

<footer>
  <Container>
    <p class="h1">
      <span class="half">
        Plan anything.<br />
        Share everything.<br />
      </span>
      Be safe online.
    </p>
    <p class="half">
      <small>&copy; {year} Pocketrides, Inc.</small>
    </p>
  </Container>
</footer>

<style>
  footer {
    width: 100%;
    background: rgb(var(--dark));
    color: rgb(var(--light));
  }

  .half {
    color: rgba(var(--light), 0.5);
  }
</style>
