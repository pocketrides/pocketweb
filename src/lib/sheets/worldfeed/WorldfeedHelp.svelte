<script lang="ts">
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
</script>

<Sheet id="worldfeed_help" header="About Worldfeed" icon="info" close="Done">
  <div data-flex="v" data-gap="1">
    <Container padded rounded fill="system-superlight">
      <div data-flex="v" data-gap>
        <h2>How Worldfeed works</h2>
        <p>
          When you tap "Add to Worldfeed", we use your device's location to determine
          your city, state and country. That information is included on the post or
          pocket, which we use to show on the Worldfeed.
        </p>
      </div>
    </Container>
    <div data-flex="v" data-gap>
      <h2>Who can see your content?</h2>
      <p>
        Anyone who visits the Worldfeed page from the city and state you're in could
        see your post or pocket. Each Worldfeed city feed is sorted by likes over the
        past day, week, and month. If your post gets enough likes (or your pocket has
        a lot of members), it could be visible at the state and country level too.
      </p>
    </div>
    <div data-flex="v" data-gap class="half">
      <h3 class="small">
        <Icon icon="info" />
        Location &amp; Privacy
      </h3>
      <p class="small">
        We may collect your device's latitude and longitude to determine your current
        city, state/territory, and country. No precise location data is ever stored,
        only the extracted city, state/territory and country. Turning off "Add to
        Worldfeed" from posts or pockets permanently deletes the information.
      </p>
      <p class="small">
        <strong>Content notice:</strong> Worldfeed only includes content eligible for
        likes. See
        <a href="/terms-of-use" class="h3 small" target="_blank">Terms of Use</a>.
      </p>
    </div>
  </div>
</Sheet>
