<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
</script>

<Container padded>
  <Container rounded fill="system-superlight">
    <div data-flex="v as" data-gap>
      <div>
        <small class="half">
          <Icon icon="visibility_off" /> Only you can see this.
        </small>
        <h2>Heads up! <span class="thin">You&rsquo;re in free mode.</span></h2>
      </div>
      <p>
        Follow your friends, reply to their posts, and join pockets (coming soon).
      </p>
      <p>
        When you're ready, tap Subscribe. You won't be able to post content or get
        paid without subscribing first.
      </p>
    </div>
  </Container>
</Container>
