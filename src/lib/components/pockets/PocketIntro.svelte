<script lang="ts">
  import Container from '../Container.svelte';
</script>

<div data-flex="v" data-gap="1">
  <Container padded rounded fill="light">
    <p class="h2">Pockets are for anything.</p>
    <p>
      From fandoms to road trips to farmers markets. A Pocket is a do-anything space
      for your community: your own corner of the internet, for whatever it is you do.
    </p>
  </Container>
  <Container padded rounded fill="light">
    <p class="h2">Pockets are free to join.</p>
    <p>
      Everyone can join up to three Pockets for free, make as many posts as they
      want, and hang out in the group chat.
    </p>
  </Container>
  <Container padded rounded fill="light">
    <div data-flex="v" data-gap>
      <p class="h2">How does privacy work?</p>
      <p>
        Choose the privacy setting that's best, every time you publish your Pocket:
      </p>
      <p>
        <strong>It's public.</strong> Your Pocket is visible on your profile page. It
        will show up in search results, too.
      </p>
      <p>
        <strong>Hide it from my profile.</strong> Only people with the link (and you,
        of course) can see it.
      </p>
    </div>
  </Container>
  <Container padded rounded fill="light">
    <div data-flex="v" data-gap>
      <p class="h2">Who can join it?</p>
      <p>Choose the way people join, every time you publish your Pocket:</p>
      <p>
        <strong>Anyone, automatically.</strong> Full public access, anyone can join in
        a tap.
      </p>
      <p>
        <strong>Let me approve.</strong> Friends will request to join, and you'll
        have to approve them. Tap <strong>Manage</strong> on your Pocket to see the list
        of who's waiting, admitted, and blocked.
      </p>
      <p>
        <strong>Broadcast Mode.</strong> This puts your Pocket into follow mode, so folks
        can only comment on posts you or cohosts make. It also disables the group chat.
      </p>
    </div>
  </Container>
</div>
