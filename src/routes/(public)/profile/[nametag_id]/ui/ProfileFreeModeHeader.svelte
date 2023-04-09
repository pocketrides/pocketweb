<script lang="ts">
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
</script>

<Container padded>
  <Container rounded bordered fill="system-superlight">
    <div data-flex="v as" data-gap="1">
      <div>
        <h2>Hello! <span class="half">You&rsquo;re in free mode.</span></h2>
      </div>
      <p class="h3">
        Follow your friends, reply to their posts, and join up to three pockets.
      </p>
      <p>
        When you're ready, tap Subscribe. You won't be able to post content or create
        pockets of your own until you subscribe..
      </p>
    </div>
  </Container>

  <p class="small half" data-padded>
    <Icon icon="visibility_off" /> Only you can see this.
  </p>
</Container>
