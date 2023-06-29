<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import { App } from '$lib/stores/app';

  export let include_header: boolean = true;
</script>

<div data-flex="v" data-gap="1" class:mini={!include_header}>
  {#if include_header}
    <Container>
      <Container rounded fill="system-superlight">
        <div>
          <p class="h2 half">What is this exactly?</p>
          <h2 class="h2">A digital community space without ads or algorithms.</h2>
        </div>
      </Container>
      <Container>
        <p data-ph class="h2">
          100% of profits are committed to equitable climate action.
        </p>
        <p class="h3 thin" data-ph>
          Use the sections below to learn about Pocketrides. Have questions?
        </p>
        <p><a href="/help" class="strong">Get in touch.</a></p>
      </Container>
    </Container>
  {/if}
  <div data-richtext>
    {#if include_header}
      <section>
        <div>
          <h2 id="bias">How do you keep me safe?</h2>
          <p>
            As part of the platform's incentive structure to reward good content, we
            take a very opinionated stance on NSFW ("Not Safe For Work") content. If
            your content doesn't pass the platform's monetization checks, we will
            automatically enable NSFW mode.
          </p>
          <p>Only subscribers can see NSFW content.</p>
          <p>
            We do this to support our most vulnerable customers: young people. If
            you're able to subscribe (meaning you have a bank account), we believe
            you are fully entitled to see what you want. Without subscribing, we
            cannot meaningfully verify you are legally allowed to view NSFW content.
          </p>
          <p>
            We look forward to actively participating in the evolution of free speech
            on the platform. Pocketrides is firmly anti-censorship, while recognizing
            this is still the Internet and bad actors are part of the fabric of a
            digital community space.
          </p>
        </div>
        <label
          data-3d
          class="small strong"
          data-fill="system-superlight"
          data-gap="0"
          aria-labelledby="bias"
        >
          <Icon icon="unfold_more" />
          <input type="checkbox" />
          Expand
        </label>
      </section>
      <section>
        <div>
          <h2 id="bias">How does moderation work?</h2>
          <p>
            Content moderation (sometimes referred to as censorship) works
            differently on Pocketrides. The platform is designed with a powerful
            incentive structure: rewarding content authors with money. But what
            happens when it goes wrong?
          </p>
          <p>
            We moderate content for monetization. That means if your content can't be
            monetized (per Stripe's <a
              href="https://stripe.com/legal/restricted-businesses"
              target="_blank"
              rel="noreferrer">Prohibited and Restricted Businesses</a
            >), we disable monetization, prevent it from appearing on the Worldfeed,
            and mark it as NSFW ("Not Safe For Work"). (Only subscribers can see NSFW
            content.)
          </p>
          <p>
            This goes wrong sometimes! If your content fails moderation, you'll see a <strong
              >Dispute</strong
            > button to send it to a human to review. As part of that process, you will
            see exactly what the AI moderator said about your content, and why it's been
            demonetized. You can always edit your content, by the way.
          </p>
        </div>
        <label
          data-3d
          class="small strong"
          data-fill="system-superlight"
          data-gap="0"
          aria-labelledby="bias"
        >
          <Icon icon="unfold_more" />
          <input type="checkbox" />
          Expand
        </label>
      </section>
      <section>
        <div>
          <h2 id="tbl">How can I trust Pocketrides?</h2>
          <p>
            Surveillance capitalism has no place on Pocketrides, period, ever. We
            make a product that has a host of great features with more on the way,
            and will always be 100% subscriber-funded. We're 100% employee-owned and
            not funded by Big Tech venture capital. That means we only answer to you:
            our customers.
          </p>
          <p>
            We take our responsibility as owner/operators of an online platform
            incredibly seriously. We issue quarterly transparency reports for both
            the Platform side of the business, as well as the Climate Action side of
            the business. The links for both are at the bottom of every page on
            Pocketrides: look for "Transparency" and "Pocketchange."
          </p>
          <p>
            Trust has to be earned, and you're in control at all times by continuing
            to subscribe. Should our mission ever deviate, stop paying us. Organize a
            mass cancellation. We will make it right.
          </p>
          <p>
            Our plans for the future do not include 3rd-party external ownership. A
            payday, believe it or not, is <strong>not</strong> why Pocketrides was created.
            Instead, we have implemented a lifetime performance-based earnings cap for
            all employees. Employee and founder performance is based on how much money
            is successfully deployed for climate action, not how many features we ship
            or how many subscribers we retain QoQ.
          </p>
          <p>
            A new generation of ethical businesses, treating customers like humans,
            using profits to enrich all of society.
          </p>
          <p>That's the Pocketrides promise.</p>
        </div>
        <label
          data-3d
          class="small strong"
          data-fill="system-superlight"
          data-gap="0"
          aria-labelledby="tbl"
        >
          <Icon icon="unfold_more" />
          <input type="checkbox" />
          Expand
        </label>
      </section>
    {/if}
    <section>
      <div>
        <h2>Why does it cost money?</h2>
        <p>
          We don't sell your data to advertisers, which is how most free tech
          companies operate. You can get a lot out of Pocketrides without spending
          any money, and you always get paid for likes on your content regardless if
          you're subscribed or not.
        </p>
        <p>
          Because we're subscriber-funded, it puts you, the subscriber, in control of
          our decision making. If we ever screw up, you have a powerful tool to make
          us fix our mistake: stop paying. We'll figure out <em>real</em> quick that we
          did something wrong.
        </p>
        <p>
          (Also, if we're ever force-acquired by an evil tech company then you should
          totally stop paying. We're billionaire-proof!)
        </p>
      </div>
      <label data-3d class="small strong" data-fill="system-superlight" data-gap="0">
        <Icon icon="unfold_more" />
        <input type="checkbox" />
        Expand
      </label>
    </section>
    <section>
      <div>
        <h2>How do I get started?</h2>
        <p>
          Pocketrides is new. To get the most out of it, we recommend creating a
          Pocket (it's free) and inviting your friends to join (it's free for them,
          too). Text them the link, post it on your story, wherever it is you already
          tell people what you're up to.
        </p>
        <p>
          Your first Pocket can be as simple as "just trying this out" — but use your
          creativity. What do you like to do, how do you spend your time? Chances are
          high that it'll make a great Pocket.
        </p>
        <p>
          There are great examples available when making a Pocket, look for the "Get
          inspired" button.
        </p>
      </div>
      <label data-3d class="small strong" data-fill="system-superlight" data-gap="0">
        <Icon icon="unfold_more" />
        <input type="checkbox" />
        Expand
      </label>
    </section>
    <section>
      <div>
        <h2>How do you protect my peace?</h2>
        <p>
          Free platforms only make money when they show you an ad, which means they
          need you to keep scrolling for hours. <a
            href="https://www.teenvogue.com/story/the-science-behind-social-medias-hold-on-our-mental-health"
            target="_blank"
            rel="noreferrer">Here's Teen Vogue</a
          > on why that can lead to poor mental health (and other not-great outcomes).
        </p>
        <p>We don't do that.</p>
        <p>
          On Pocketrides, your home feed has an ending and always stays in
          chronological order. It doesn't move around when you open the app, and the
          newest content is always at the bottom. Once you do read everything,
          tapping "Load More" loads the newest posts.
        </p>
        <p>
          We also built the <Button inline icon="support" label="Quarantine" /> button
          so that when you see something that's not for you, it's easy to hide. Think
          of it as feedback for the author, so they know their audience didn't like what
          they posted.
        </p>
        <p>
          It's purposeful and intentional. It's the conversation - in the order it
          happened, with a way of hiding content you don't like.
        </p>
        <!-- <p>
          What you see online, and how you consume content, massively affects your
          mood. Pocketrides does not have algorithmic content like "suggested posts,"
          which means it's harder to doom scroll on Pocketrides.
        </p>
        <p>
          Other platforms are designed to keep you scrolling on the platform by
          rewarding your <a
            href="https://www.teenvogue.com/story/the-science-behind-social-medias-hold-on-our-mental-health"
            target="_blank"
            rel="noreferrer">dopamine receptors</a
          >. The longer you're on the platform, the more money they make
          through ad sales, and the more data they collect about your preferences,
          habits, and purchasing decisions.
        </p> -->
      </div>
      <label data-3d class="small strong" data-fill="system-superlight" data-gap="0">
        <Icon icon="unfold_more" />
        <input type="checkbox" />
        Expand
      </label>
    </section>
    <section>
      <div>
        <h2 id="we-love-creators">How do you support my community?</h2>
        <p>
          Every like on the platform is worth a penny. We believe your creativity and
          your contributions to the conversation are inherently valuable. Start a
          Payout in Settings when you have 500 likes — that's $5! No subscription is
          required to get paid.
        </p>
        <p>
          We do this because your creativity adds all the value to a social network.
          Creators love YouTube's revenue sharing program, but it's still the only
          meaningful revenue sharing program online. Until now.
        </p>
        <p>
          Pocketrides' revenue split is 50/50: Unlimited costs $5/mo, and you can
          then give out 250 likes ($2.50) every time it renews. Likes never expire,
          by the way, and it's easy to pause your subscription in Settings.
        </p>
      </div>
      <label
        data-3d
        class="small strong"
        data-fill="system-superlight"
        data-gap="0"
        id="we-love-creators"
      >
        <Icon icon="unfold_more" />
        <input type="checkbox" />
        Expand
      </label>
    </section>
    <section>
      <div>
        <h2 id="ptc">How do you support our planet?</h2>
        <p>
          By using our <a href="/pocket/362022120043053129"
            >profits for climate action,</a
          >
          we aspire to be a source of hope and forward momentum: doing the hard work needed
          to confront an existential crisis.
        </p>
        <p>
          We'll announce plenty of details and ask you for feedback as we get up to
          speed (and begin to have profits, starting when we have 50,001
          subscribers). The plan is this easy to understand: fund nonprofits working
          in communities impacted by climate change.
        </p>
        <p>
          As we get bigger, we'll announce additional goals like funding climate
          justice lawsuits and investing in the next generation of green energy
          companies.
        </p>
        <p>
          Funding an ethical, equitable, green future is a noble goal as long as
          everyone benefits. Doing the most good will always be our North Star, which
          is why we're so focused on being so transparent from the beginning.
        </p>
      </div>
      <label
        data-3d
        class="small strong"
        data-fill="system-superlight"
        data-gap="0"
        aria-labelledby="ptc"
      >
        <Icon icon="unfold_more" />
        <input type="checkbox" />
        Expand
      </label>
    </section>
    {#if !include_header}
      <div data-padded>
        Read more:<br /><a
          href="#why"
          on:click|preventDefault={() => {
            $App.sheet_id = 'why_pocketrides';
          }}>Why Pocketrides?</a
        >
      </div>
    {/if}
  </div>
  <!-- <div>
      <Button
        label="Done"
        on:click={() => {
          $App.sheet_id = '';
        }}
      />
    </div> -->
</div>

<style lang="scss">
  section {
    // margin-bottom: 2rem;
    padding: 3rem 2rem;
    border-top: 1px solid rgba(var(--dark), 0.25);

    &:last-child {
      border-bottom: 1px solid rgba(var(--dark), 0.25);
    }

    @media (min-width: 640px) {
      border: 1px solid rgba(var(--dark), 0.25);
      border-radius: 1rem;
      margin-bottom: 3rem;
    }

    div {
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;

      > *:not(h2) {
        display: inline;
      }

      :global(button) {
        margin-left: 1px;
      }
    }

    &:has(input:checked) div {
      display: block;

      > *:not(h2) {
        display: block;
      }
    }

    &:has(input:checked) label {
      display: none;
    }

    h2 {
      font-size: 1.25rem;
    }

    label {
      font-size: 1rem;
      margin-top: 0.5rem;
      display: inline-flex;

      input {
        opacity: 0;
        position: absolute;
      }
    }
  }

  .mini section {
    padding: 1rem;

    @media (min-width: 640px) {
      border: 1px solid rgba(var(--dark), 0.25);
      border-radius: 1rem;
      margin-bottom: 1rem;
    }

    div {
      > *:not(h2) {
        display: none;
      }
    }
  }

  .mini [data-padded] {
    margin-bottom: 1rem;
  }
</style>
