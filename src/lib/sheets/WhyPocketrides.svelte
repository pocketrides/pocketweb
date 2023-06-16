<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import { App } from '$lib/stores/app';
</script>

<Sheet id="why_pocketrides" header="Why Pocketrides?" close="Done">
  <div data-flex="v" data-gap="1">
    <Container rounded fill="system-superlight">
      <div data-flex="v" data-gap data-richtext>
        <h2>
          <a
            href="https://www.youtube.com/live/WXmtd-Lf4Do?feature=share&t=250"
            target="_blank"
            rel="noreferrer">According to the CDC,</a
          >
          young Americans are experiencing a mental health crisis.
        </h2>
      </div>
    </Container>
    <div data-flex="v" data-gap data-richtext>
      <h2>
        Truly alarming statistics. But what can a social network do to tackle the
        root cause?
      </h2>
      <h3>
        Pocketrides has three core features that work together for a positive mental
        health outcome:
      </h3>
      <ol>
        <li>No algorithmic content.</li>
        <li>The Quarantine button.</li>
        <li>An ethical business model.</li>
      </ol>
      <h2 data-ph>No algorithmic content</h2>
      <p>
        Pocketrides has no algorithmic recommended content, no "suggested posts," and
        no doom-scrolling. We purposefully keep your home feed in chronological order
        — and it has an ending. When you reach the bottom, you're done for the day.
      </p>
      <p>
        We believe this will help your mental health in the long run, because the
        apps we use all day are tiny dopamine machines, and <a
          href="https://www.teenvogue.com/story/the-science-behind-social-medias-hold-on-our-mental-health"
          target="_blank"
          rel="noreferrer"
          >a dopamine deficit is attributed to depression and addiction</a
        >.
      </p>
      <h2 data-ph>The Quarantine button</h2>
      <p>
        At Pocketrides, one of our core beliefs is that you should be in control of
        what you see online. We built the <Button
          inline
          icon="support"
          label="Quarantine"
        /> button so that when you see something that's not for you, it's easy to hide.
      </p>
      <p>
        The Quarantine button has a double purpose: you don't see that particular
        content anymore, and the author gets the feedback that their audience doesn't
        like what they posted.
      </p>
      <h2 data-ph>An ethical business model</h2>
      <p>
        The economics of modern social networks aren't that hard to understand: you
        see an ad, the platform makes money. Everyone gets a free place to
        communicate and share their creativity, and platforms can pay the bills.
        Why's that so bad?
      </p>
      <p>
        In its most recent quarter, it was estimated that Facebook now makes <a
          href="https://twitter.com/tanayj/status/1651334563401027584"
          target="_blank"
          rel="noreferrer">over $200 a year</a
        >
        from our eyeballs. In the relentless quest for
        <a
          href="https://en.wikipedia.org/wiki/Shareholder_primacy"
          target="_blank"
          rel="noreferrer">shareholder profits,</a
        >
        showing you more ads directly equals more profit. And the more targeted an ad
        can be, the more these platforms earn — even if it means selling your most private
        moments
        <a
          href="https://revealnews.org/article/facebook-data-abortion-crisis-pregnancy-center/"
          target="_blank"
          rel="noreferrer">like a trip to an abortion clinic</a
        >.
      </p>
      <p>
        Pocketrides has a business model that intentionally <strong
          >does not make money</strong
        > from your eyeballs. For people who want to subscribe, it's $5/mo. If not, pockets
        are free to join so your friends never miss out.
      </p>
      <p>
        Bottom line: surveillance capitalism has no place on Pocketrides, period. We
        make a product that has a host of great features, and will always be 100%
        subscriber-funded. We are 100% employee-owned and bootstrapped, <a
          href="https://kinsta.com/blog/vc-route/"
          target="_blank"
          rel="noreferrer">not VC-funded.</a
        >
      </p>
    </div>
    <div>
      <Button
        label="Done"
        on:click={() => {
          $App.sheet_id = '';
        }}
      />
    </div>
  </div>
</Sheet>
