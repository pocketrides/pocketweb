<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
</script>

<Sheet id="why_pocketrides" header="Why Pocketrides?" close="Done" padded={false}>
  <div data-flex="v" data-gap="1">
    <Container>
      <Container rounded fill="system-superlight">
        <div>
          <p class="h2 half">What is this exactly?</p>
          <h2 class="h2">
            Pocketrides is an authentic digital community space without ads,
            algorithms, or data sales.
          </h2>
        </div>
      </Container>

      <Container>
        <p class="h2 thin" data-ph>
          We're a Big Tech alternative: a social network designed for better mental
          health outcomes.
        </p>
        <p class="h3 thin" data-ph>
          Use the sections below to learn about how platform design plays a role in a
          better outcome for everyone. Have questions? <a href="/help" class="strong"
            >Get in touch.</a
          >
        </p>
      </Container>
    </Container>
    <div data-richtext>
      <section>
        <div>
          <h2>Protect your peace.</h2>
          <p>
            Pocketrides does not have algorithmic content like "suggested posts."
            This will decrease the risk of addiction and improve mental health
            outcomes, especially in developing brains. Our design approach uses <a
              href="https://en.wikipedia.org/wiki/Empathic_design"
              target="_blank"
              rel="noreferrer">empathic design</a
            >
            instead of traditional commercial
            <a
              href="https://en.wikipedia.org/wiki/Dark_pattern"
              target="_blank"
              rel="noreferrer">dark patterns</a
            >.
          </p>
        </div>
        <label
          data-3d
          class="small strong"
          data-fill="system-superlight"
          data-gap="0"
        >
          <Icon icon="unfold_more" />
          <input type="checkbox" />
          Expand
        </label>
      </section>
      <section>
        <div>
          <h2 id="badalgo">No algorithmic content.</h2>
          <p>
            Traditional platforms are designed to keep you scrolling on the platform
            by rewarding your <a
              href="https://www.teenvogue.com/story/the-science-behind-social-medias-hold-on-our-mental-health"
              target="_blank"
              rel="noreferrer">dopamine receptors</a
            >. The longer you're on the platform, the more money they make through ad
            sales, and the more data they collect about your preferences, habits, and
            purchasing decisions.
          </p>
        </div>
        <label
          data-3d
          class="small strong"
          data-fill="system-superlight"
          data-gap="0"
          aria-labelledby="badalgo"
        >
          <Icon icon="unfold_more" />
          <input type="checkbox" />
          Expand
        </label>
      </section>
      <section>
        <div>
          <h2 id="we-love-creators">Creators add all the value.</h2>
          <p>
            Every like on the platform is worth one cent. We believe your creativity
            and what you contribute are inherently valuable. Start a Payout in
            Settings when you have 500 — that's $5! No subscription required.
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
          <h2 id="yic">You're in control of what you see.</h2>
          <p>
            We built the <Button inline icon="support" label="Quarantine" /> button so
            that when you see something that's not for you, it's easy to hide. Think of
            it as feedback for the author, so they know their audience didn't like what
            they posted.
          </p>
        </div>
        <label
          data-3d
          class="small strong"
          data-fill="system-superlight"
          data-gap="0"
          aria-labelledby="yic"
        >
          <Icon icon="unfold_more" />
          <input type="checkbox" />
          Expand
        </label>
      </section>
      <section>
        <div>
          <h2 id="adds">Ad-free, data-safe.</h2>
          <p>
            Our business model intentionally <strong>does not</strong> make money from
            ads or selling your private data. For people who want to subscribe, it's $5/mo.
            If not, Pockets are free to join so your friends never miss out.
          </p>
        </div>
        <label
          data-3d
          class="small strong"
          data-fill="system-superlight"
          data-gap="0"
          aria-labelledby="adds"
        >
          <Icon icon="unfold_more" />
          <input type="checkbox" />
          Expand
        </label>
      </section>
      <section>
        <div>
          <h2 id="ptc">Profits to climate.</h2>
          <p>
            By using our <a href="/pocket/362022120043053129"
              >profits for climate action,</a
            >
            we aspire to be a source of hope and forward momentum: doing the hard work
            needed to confront an existential crisis.
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
      <section>
        <div>
          <h2 id="bias">No bias, just rules.</h2>
          <p>
            Content moderation (what some refer to as censorship) works differently
            on Pocketrides. The platform is designed with a powerful incentive
            structure: rewarding content authors with money. But what happens when it
            goes wrong?
          </p>
          <p>
            We moderate content for monetization. That means if your content can't be
            monetized (per Stripe's <a
              href="https://stripe.com/legal/restricted-businesses"
              target="_blank"
              rel="noreferrer">Prohibited and Restricted Businesses</a
            >), we disable monetization, prevent it from appearing on the Worldfeed,
            and mark it as NSFW.
          </p>
          <p>
            This goes wrong sometimes! If your content fails moderation, tap <Button
              inline
              label="Dispute"
            /> to send it to a human to review. As part of that process, you will see
            exactly what the AI moderator said about your content, and why it's been demonetized.
            (You can always edit your content, by the way.)
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
          <h2 id="bias">Content Safety on Pocketrides.</h2>
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
          <h2 id="tbl">The bottom line.</h2>
          <p>
            Surveillance capitalism has no place on Pocketrides, period, ever. We
            make a product that has a host of great features, and will always be 100%
            subscriber-funded. We are 100% employee-owned and bootstrapped,
            <a
              href="https://kinsta.com/blog/vc-route/"
              target="_blank"
              rel="noreferrer">not VC-funded</a
            >.
          </p>
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
</Sheet>

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
      -webkit-line-clamp: 2;
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
</style>
