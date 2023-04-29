<script lang="ts">
  import Sheet from '$lib/components/Sheet.svelte';
  import AppHelpContent from './AppHelp/AppHelpContent.svelte';
</script>

<Sheet id="app_help" header="Add to Home Screen" icon="add_to_home_screen">
  <AppHelpContent />
</Sheet>
<Sheet id="app_help_joined" header="You're in!" icon="done">
  <AppHelpContent />
</Sheet>
