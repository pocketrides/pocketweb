<script lang="ts">
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
</script>

<Container padded>
  <div data-flex="v" data-gap="1">
    <Container rounded bordered fill="system-superlight">
      <div data-flex="v as" data-gap>
        <h2>Hello! <span class="half">You&rsquo;re in free mode.</span></h2>
        <p class="h3">
          Follow your friends, reply to their posts, join up to three pockets, and <a
            href="/pocket"
            class="h3">make one of your own</a
          >.
        </p>
      </div>
    </Container>
    <Container>
      <div data-flex="v" data-gap>
        <h3>Enjoying Pocketrides? Consider subscribing.</h3>
        <p>
          We're a subscriber-funded platform that prioritizes your digital mental
          health through less-addictive design.
        </p>
      </div>
    </Container>

    <p class="small half" data-padded>
      <Icon icon="visibility_off" /> Only you can see this.
    </p>
  </div>
</Container>
