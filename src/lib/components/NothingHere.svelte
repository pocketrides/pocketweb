<script lang="ts">
  import Container from './Container.svelte';
  import Icon from './Icon.svelte';
</script>

<Container padded rounded bordered fill="superlight">
  <div class="none" data-flex="v as je" data-nothing-here>
    <h2 class="h1 jumbo half thin" data-flex="v as" data-gap>
      <Icon icon="sentiment_content" inline />
      <span>Nothing here… <span class="half">yet!</span></span>
    </h2>
  </div>
</Container>

<style lang="scss">
  @media (max-width: 640px) {
    .none {
      aspect-ratio: 12/16;
    }
  }

  @media (min-width: 640px) {
    .none {
      aspect-ratio: 16/9;
    }
  }
</style>
