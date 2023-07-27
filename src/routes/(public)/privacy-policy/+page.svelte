<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import { App } from '$lib/stores/app';

  $App.theme = 'system';
  // $App.fill = 'system-light';
</script>

<svelte:head>
  <title>Privacy Policy | on pocketrides!</title>
</svelte:head>

<SiteHeader huddable>
  <h1 slot="left">
    <Icon icon="privacy_tip" />
    Privacy Policy
  </h1>
  <span slot="right" />
</SiteHeader>
<Main fullheight>
  <div data-flex="v" data-gap="1">
    <div>
      <h2 class="h3">Last updated: March 30th, 2023</h2>
    </div>
    <article data-richtext>
      <h2>Introduction</h2>
      <h3>
        Our business model precludes us from selling your private data for money. We
        will never text you with spam.
      </h3>
      <p>
        Pocketrides, Inc. is committed to protecting the privacy of our users and
        utilizes the services of various service providers to provide the best
        possible user experience. These service providers include Cloudflare,
        Cloudinary, Fauna, Fathom, Magic Bell, Open AI, Stripe, and Stytch. These
        service providers assist us with website hosting, data storage and
        management, payment processing, and website analytics.
      </p>
      <h2>Types of Personal Information Collected:</h2>
      <p>We may collect the following types of personal information about you:</p>
      <ul>
        <li>
          Contact information, such as your name, email address, and postal address;
        </li>
        <li>Profile information, such as your username and password;</li>
        <li>
          Content that you upload to our platform, including text, images, and
          videos;
        </li>
        <li>
          Information about your interactions with our platform, including likes and
          comments;
        </li>
        <li>Information about your device, such as IP address and browser type;</li>
      </ul>
      <h2>Purpose of Processing Personal Information:</h2>
      <p>
        The personal information we collect is used to provide and improve our
        platform, and to communicate with you. We may use your personal information
        for the following purposes:
      </p>
      <ul>
        <li>To provide the platform and deliver the services you request;</li>
        <li>
          To communicate with you about your account, and to respond to your
          inquiries;
        </li>
        <li>To enforce our terms of use and to prevent misuse of our platform;</li>
        <li>
          To comply with legal obligations, such as responding to requests from law
          enforcement
        </li>
        agencies;
      </ul>
      <h2>Legal Basis for Processing Personal Information:</h2>
      <p>
        The legal basis for processing your personal information will depend on the
        specific context in which we collect it. However, the main legal basis we
        rely on to process your personal information are:
      </p>
      <ul>
        <li>
          Your consent, for example when you sign up for an account or upload content
          to our platform;
        </li>
        <li>
          The performance of a contract, for example to provide you with the services
          you request;
        </li>
        <li>
          Our legitimate interests, for example to enforce our terms of use, or to
          prevent fraud;
        </li>
        <li>
          Compliance with legal obligations, for example to respond to requests from
          law enforcement agencies;
        </li>
      </ul>
      <h2>Sharing Personal Information:</h2>
      <p>
        We may share your personal information with third parties for the following
        purposes:
      </p>
      <ul>
        <li>
          With service providers, such as payment processors and hosting companies,
          who help us provide and improve our platform;
        </li>
        <li>
          With law enforcement agencies, if we are required to do so by law or to
          prevent or investigate illegal activity;
        </li>
        <li>
          With other users of the platform, if you upload content that is public or
          shared with others;
        </li>
      </ul>
      <h2>Data Retention:</h2>
      <p>
        We will retain your personal information for as long as necessary to fulfill
        the purposes outlined in this Privacy Policy, or as required by law.
      </p>
      <h2>Your Rights:</h2>
      <p>
        Under the GDPR (General Data Protection Regulation) and CCPA (California
        Consumer Privacy Act), you have the following rights in relation to your
        personal information:
      </p>
      <ul>
        <li>
          The right to access your personal information and to receive a copy of it;
        </li>
        <li>The right to rectify any inaccurate personal information;</li>
        <li>
          The right to erase your personal information in certain circumstances;
        </li>
        <li>
          The right to restrict or object to the processing of your personal
          information;
        </li>
        <li>
          The right to data portability, which allows you to receive your personal
          information in a structured, commonly used, and machine-readable format;
        </li>
      </ul>
      <p>We will not sell your personal information to anyone ever.</p>
      <h2>Contact Information:</h2>
      <p>
        If you have any questions about this Privacy Policy please contact us at <a
          href="mailto:hello@pocketrides.cc?subject=Privacy Policy inquiry"
        >
          hello@pocketrides.cc
        </a>
      </p>
      <h2>Changes to this Privacy Policy:</h2>
      <p>
        We may update this Privacy Policy from time to time, so please review it
        periodically. If we make significant changes, we will notify you by posting a
        notice on our platform.
      </p>
      <p>Last updated: 3/30/2023</p>
    </article>
  </div>
</Main>
