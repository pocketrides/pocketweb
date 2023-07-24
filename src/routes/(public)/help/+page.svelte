<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import { App } from '$lib/stores/app';

  $App.theme = 'system';
  // $App.fill = 'system-light';
</script>

<svelte:head>
  <title>Contact Pocketrides</title>
  <meta property="og:title" content="Need help?" />
  <meta property="og:description" content="We're all ears!" />
  <meta name="description" content="We're all ears!" />
</svelte:head>

<SiteHeader huddable />
<Main fullheight>
  <div data-flex="v" data-gap="1">
    <h1 data-ph>
      <Icon icon="mark_email_unread" />
      Contact Pocketrides
    </h1>
    <Container rounded fill="system-superlight">
      <div data-flex="v as" data-gap>
        <h2>Need help? Have a question or feature suggestion?</h2>
        <p>We're all ears. Shoot us an email and we'll get right back to you.</p>
        <div data-flex data-gap>
          <Button
            label="Email us"
            href="mailto:hello@pocketrides.cc?subject=Hello!"
          />
          <Button label="Suggest a feature" href="/pocket/362021519145041997" />
        </div>
      </div>
    </Container>
    <h2 data-ph>
      <Icon icon="tips_and_updates" />
      About Pocketrides
    </h2>
    <div data-richtext>
      <p>
        <strong
          >Pocketrides was founded in a Fayetteville, AR shed in early 2022 with the
          goal of making group bike rides with friends easier to plan.</strong
        >
      </p>
      <p>
        <strong
          >Over the course of a year (and several twists and turns), our vision
          expanded to become an all-in-one group messaging platform and digital town
          square.</strong
        >
      </p>
      <p>
        Our name is a reference to the wonderful community of cyclists we're lucky to
        call our friends, who showed us that taking care of each other and where we
        live is the building block for a society that works for everyone.
      </p>
      <p>
        Creating a social platform during the year Elon took over Twitter, the
        platform we're building with Pocketrides rejects the brazen decision-making
        of a few tech executives and instead, <a href="/pocket/362021519145041997"
          >is looking to the community for help</a
        >. Here's where we're at so far:
      </p>
      <ol>
        <li>Instead of endless scrolling, your home feed has an ending.</li>
        <li>Likes given out by subscribers are worth a penny each.</li>
        <li>
          The company's business model precludes us from selling customer data to
          make money.
        </li>
      </ol>
      <p>
        Our vision is to steward a digital community built with the kinds of features
        that help the cities where we live thrive, while solving real pain points
        like finding community at a local level.
      </p>
      <p>
        By starting from an <a href="/pocket/364647123794264137"
          >ethical place as a company,</a
        > we hope to give the next generation of content creators, community activists,
        artists, musicians and creatives a healthier place to express themselves, while
        having a transparent and fair way to earn from their creativity.
      </p>
      <p>
        And by committing our <a href="/pocket/362022120043053129"
          >profits for climate action,</a
        >
        we aspire to be a source of hope and forward momentum, doing the hard work to
        confront an existential crisis made worse by our global economic model of greed
        and extraction. A green future driven by
        <a
          href="https://en.wikipedia.org/wiki/Circular_economy"
          target="_blank"
          rel="noreferrer">a circular economy</a
        > is possible, and we can build it together on Pocketrides.
      </p>
      <p>— Michael & Caleb<br />May 2023</p>
    </div>
  </div>
</Main>
