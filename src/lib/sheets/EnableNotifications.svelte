<script lang="ts">
  import Sheet from '$lib/components/Sheet.svelte';
  import Container from '$lib/components/Container.svelte';
  import Button from '$lib/components/Button.svelte';
</script>

<Sheet
  id="enable-notifications"
  header="Enable notifications?"
  icon="notifications_active"
>
  <div data-flex="v" data-gap>
    <Container rounded fill="superlight">
      <div data-flex="v cc" data-gap="1">
        <div data-flex="v as" data-gap>
          <h2>Stay updated!</h2>
          <p>
            Get real-time updates from your friends by turning on notifications. You
            can turn them off any time in Settings.
          </p>
        </div>
        <div class="wrapper" data-flex="v cc" data-gap="1">
          <Button label="Enable notifications" xlarge primary />
          <Button label="No thanks!" />
        </div>
      </div>
    </Container>
  </div>
</Sheet>

<style lang="scss">
  .wrapper {
    margin: 3rem 0;
  }
</style>
