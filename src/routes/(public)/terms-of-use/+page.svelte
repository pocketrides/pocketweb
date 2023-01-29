<script lang="ts">
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import { App } from '$lib/stores/app';

  $App.fill = 'superlight';
</script>

<SiteHeader />
<Main>
  <div data-flex="v" data-gap>
    <div>
      <h1 class="jumbo">Terms of Use</h1>
      <h2 class="h3">Last updated: Jaunary 28th, 2023</h2>
    </div>
    <div>
      <h2>Introduction</h2>
      <article>
        <strong>
          Pocketrides, Inc. is committed to building a safe place online.
        </strong>
      </article>
      <article>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquam ut maiores
        odit? Porro fuga eos, blanditiis velit, sunt deserunt soluta sit unde beatae,
        eum esse deleniti ex sapiente earum nostrum!
      </article>
    </div>
    <div>
      <h2>Prohibited Activities</h2>
      <article>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptate officia
        quasi sint ullam, blanditiis molestiae eum labore expedita, libero quis
        dolores dignissimos facilis perspiciatis dolorum iusto vel saepe! Reiciendis,
        nihil.
      </article>
    </div>
  </div>
</Main>

<style lang="scss">
  article:not(:last-child) {
    margin-bottom: 1.5rem;
  }

  ul {
    margin: 1rem;
  }
</style>
