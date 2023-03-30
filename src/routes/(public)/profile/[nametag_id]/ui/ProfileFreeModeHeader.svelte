<script lang="ts">
  import Button from '$lib/components/Button.svelte';
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
        Follow your friends, reply to their posts, and join up to three pockets. <span
          class="half thin small">(coming soon!)</span
        >
      </p>
      <p>
        When you're ready, tap Subscribe. You won't be able to post content without
        subscribing first.
      </p>
      <p class="small half">
        <Icon icon="visibility_off" /> Only you can see this.
      </p>
    </div>
  </Container>
</Container>
