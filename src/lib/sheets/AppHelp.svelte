<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Container from '$lib/components/Container.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import Sheet from '$lib/components/Sheet.svelte';

  $: showing_ios = true;
  $: showing_android = false;
  $: showing_computer = false;
</script>

<Sheet id="app_help" header="Add to Home Screen" icon="add_to_home_screen">
  <div data-flex="v" data-gap="1">
    <h2>Get back to Pocketrides faster when you add it to your Home Screen.</h2>
    <Container rounded fill="system-superlight">
      <div data-flex="v as" data-gap="1" aria-live="assertive">
        <Button
          label="For iOS devices"
          icon={showing_ios ? 'expand_more' : 'keyboard_arrow_right'}
          on:click={() => {
            showing_ios = !showing_ios;
          }}
        />
        {#if showing_ios}
          <div data-richtext>
            <ol>
              <li>
                While viewing the website, tap <Icon icon="ios_share" inline /> in the
                menu bar.
              </li>
              <li>Scroll down the list of options, then tap Add to Home Screen.</li>
            </ol>
            <p>
              Get stuck? Visit <a
                href="https://support.apple.com/guide/iphone/bookmark-favorite-webpages-iph42ab2f3a7/ios#iph4f9a47bbc"
                rel="noreferrer"
                target="_blank">Apple Support</a
              >.
            </p>
          </div>
        {/if}
      </div>
    </Container>
    <Container rounded fill="system-superlight">
      <div data-flex="v as" data-gap="1" aria-live="assertive">
        <Button
          label="For Android devices"
          icon={showing_android ? 'expand_more' : 'keyboard_arrow_right'}
          on:click={() => {
            showing_android = !showing_android;
          }}
        />
        {#if showing_android}
          <div data-richtext>
            <ol>
              <li>
                Tap <strong>Install</strong>.
              </li>
              <li>Follow the on-screen instructions.</li>
            </ol>
            <p>
              Get stuck? Visit <a
                href="https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DAndroid&oco=1"
                rel="noreferrer"
                target="_blank">Google Support</a
              >.
            </p>
          </div>
        {/if}
      </div>
    </Container>
    <Container rounded fill="system-superlight">
      <div data-flex="v as" data-gap="1" aria-live="assertive">
        <Button
          label="For Computers"
          icon={showing_computer ? 'expand_more' : 'keyboard_arrow_right'}
          on:click={() => {
            showing_computer = !showing_computer;
          }}
        />
        {#if showing_computer}
          <div data-richtext>
            <ol>
              <li>
                Tap <strong
                  >Install
                  <Icon icon="install_desktop" inline />
                </strong>.
              </li>
              <li>Follow the on-screen instructions.</li>
            </ol>
            <p>
              Get stuck? Visit <a
                href="https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DDesktop&oco=1"
                rel="noreferrer"
                target="_blank">Google Support</a
              >.
            </p>
          </div>
        {/if}
      </div>
    </Container>
  </div>
</Sheet>
