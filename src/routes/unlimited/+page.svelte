<script lang="ts">
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import { App } from '$lib/stores/app';

  $App.theme = 'system';
  $App.fill = 'system-superlight';
</script>

<svelte:head>
  <title>
    Go Unlimited with a $5/mo subscription and plan anything in your city | on
    Pocketrides!
  </title>
  <meta
    property="og:title"
    content="Plan great events for your city on Pocketrides"
  />
  <meta
    property="og:description"
    content="A place for groups of all sizes to plan things together"
  />
  <meta
    name="description"
    content="Use Pocketrides as an Organization or Business. We're the place for groups of all sizes to plan things together and make a great memory."
  />
</svelte:head>

<SiteHeader huddable />
<Main fullheight>
  <div data-flex="v" data-gap="1">
    <div data-flex="v" data-gap>
      <h1 data-ph>
        <Icon icon="groups" />
        For Organizations
      </h1>
    </div>
    <Container rounded fill="system-superlight">
      <h2>
        The safe place online for everyone in your community.
        <h2 class="half">
          Show off what makes your town, business, or organization unique with a
          Nametag on Pocketrides.
        </h2>
      </h2>
    </Container>
    <div data-richtext>
      <h2>How to get started</h2>
      <p>
        Your Pocketrides account is your phone number. Each phone number can have
        multiple Nametags, our version of usernames.
      </p>
      <p>As an organization, you have two options to get started:</p>
      <ol>
        <li>
          Use your <strong>personal</strong> phone number to create your own Nametag,
          then create a Business Nametag in settings.
          <strong>This is the suggested method.</strong>
        </li>
        <li>
          Use your <strong>business</strong> phone number, and create a Business Nametag.
        </li>
      </ol>
      <hr />
    </div>
    <div data-richtext>
      <h2>Using your personal number</h2>
      <ol>
        <li>
          Sign into Pocketrides with your personal number and complete registration
          if required.
        </li>
        <li>
          From your profile page, tap <strong>
            <Icon icon="settings_suggest" inline />
            Settings
          </strong> at the top.
        </li>
        <li>
          Find the section labeled Nametags. Tap <strong>
            <Icon icon="sentiment_very_satisfied" inline />
            New Nametag
          </strong>
        </li>
        <li>Create your organization's Nametag.</li>
      </ol>
      <h3>That's it!</h3>
      <p>
        Now you're using your organization's Nametag. To switch between Nametags,
        visit <strong>
          <Icon icon="settings_suggest" inline />
          Settings
        </strong>, scroll to the bottom and tap
        <strong>
          <Icon icon="logout" inline />
          Sign Out
        </strong>. Sign in again, and you'll be prompted to choose which Nametag to
        use.
      </p>
      <hr />
    </div>
    <div data-richtext>
      <h2>Using your business number</h2>
      <ol>
        <li>
          Sign into Pocketrides with your business phone number.
          <p>
            <strong>Note:</strong>
            For your convenience, we support both SMS and WhatsApp.
          </p>
        </li>
        <li>Create a Nametag for your organization.</li>
      </ol>
      <h3>That's it!</h3>
      <p>Now you're using your organization's Nametag.</p>
      <hr />
    </div>
    <div data-richtext>
      <h2>Go further with Nametag Collab</h2>
      <p>Multiple people can sign into the same Nametag with Nametag Collab.</p>
      <p>To get started:</p>
      <ol>
        <li>
          Sign into Pocketrides with the phone number associated with your Nametag.
        </li>
        <li>
          From your profile page, tap <strong>
            <Icon icon="settings_suggest" inline />
            Settings
          </strong> at the top.
        </li>
        <li>
          Find the section labeled Nametags. Tap <strong>
            <Icon icon="face_retouching_natural" inline />
            Nametag Collab
          </strong>
        </li>
        <li>
          Add friends to collaborate with.
          <p>
            <strong>Note:</strong> Only accounts your Nametag is friends with show up
            in the list. Not finding who you're looking for? Visit their profile page
            and tap the
            <strong>
              <Icon icon="person_add" inline />
              Follow
            </strong> button.
          </p>
        </li>
      </ol>
      <h3>That's it!</h3>
      <p>
        To switch between Nametags, visit <strong>
          <Icon icon="settings_suggest" inline />
          Settings
        </strong>, scroll to the bottom, and tap
        <strong>
          <Icon icon="logout" inline />
          Sign Out
        </strong>. Sign in again, and you'll be prompted to choose which Nametag to
        use.
      </p>
    </div>
    <Container fill="system-superlight" rounded>
      <div data-flex="v as" data-gap>
        <h2>Get stuck? Have a feature suggestion?</h2>
        <p>We'd love to hear from you. <a href="/help" class="h3">Contact Us</a>.</p>
      </div>
    </Container>
  </div>
</Main>
