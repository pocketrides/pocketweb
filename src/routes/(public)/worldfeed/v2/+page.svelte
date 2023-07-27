<script lang="ts">
  import Container from '$lib/components/Container.svelte';
  import Main from '$lib/components/Main.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import algoliasearch from 'algoliasearch/lite';
  import instantsearch from 'instantsearch.js';
  import aa from 'search-insights';
  import { configure, hits, index, searchBox } from 'instantsearch.js/es/widgets';
  import type { SearchClient } from 'instantsearch.js';
  import type { PageData } from './$types';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { App } from '$lib/stores/app';
  import { getSquareSmall } from '$lib/util/cloudinary';
  import type { CloudinaryPhoto } from '$lib/zod/CloudinaryPhoto';

  export let data: PageData;

  let searchClient: SearchClient;
  let search;
  let insights = true;

  $: $App.theme = 'system';

  onMount(() => {
    aa('init', {
      appId: data.algolia_app_id,
      apiKey: data.algolia_frontend_key
    });

    if (data.my_nametag) {
      aa('setUserToken', data.my_nametag.id);
    } else {
      aa('setUserToken', '');
    }

    searchClient = algoliasearch(data.algolia_app_id, data.algolia_frontend_key);

    search = instantsearch({
      searchClient,
      insights
    });

    search.addWidgets([
      searchBox({
        container: '#search-box',
        placeholder: 'Search for anything'
      }),
      index({
        indexName: 'all_nametags'
      }).addWidgets([
        configure({
          hitsPerPage: 8
        }),
        hits({
          container: '#nametag-hits',
          templates: {
            item(hit, { html, components, sendEvent }) {
              return html`
                <a
                  href="/profile/${hit.id}"
                  class="h3"
                  data-nametag
                  data-3d
                  data-theme="${hit.theme}"
                  data-fill="base"
                  onClick="${() => sendEvent('click', hit, 'nametag clicked')}"
                >
                  ${hit.nametag}
                </button>
              `;
            }
          }
        })
      ]),
      index({
        indexName: 'all_posts'
      }).addWidgets([
        configure({
          filters:
            'settings.is_nsfw:false AND settings.worldfeed.enabled:true AND audience:friends'
        }),
        hits({
          container: '#post-hits',
          templates: {
            item(hit, { html, sendEvent }) {
              let style = hit.contents[0].photos[0]
                ? `background-image: url(${getSquareSmall(
                    hit.contents[0].photos[0].version,
                    hit.contents[0].photos[0].public_id
                  )})`
                : undefined;

              return html` <a
                href="/post/${hit.id}"
                data-unstyle
                data-post-preview
                data-3d="ah"
                onClick="${() => sendEvent('click', hit, 'post clicked')}"
                data-fill="dark"
                data-flex="v je"
                style="${style}"
              >
                <p class="strong">${hit.contents[0].content_raw}</p></a
              >`;
            }
          }
        })
      ]),
      index({
        indexName: 'all_pockets'
      }).addWidgets([
        configure({
          filters: 'settings.worldfeed.enabled:true'
        }),
        hits({
          container: '#pocket-hits',
          templates: {
            item(hit, { html, sendEvent }) {
              let style = hit.cover_art[0]
                ? `background-image: url(${getSquareSmall(
                    hit.cover_art[0].version,
                    hit.cover_art[0].public_id
                  )})`
                : undefined;

              return html` <a
                href="/pocket/${hit.id}"
                data-unstyle
                data-pocket-preview
                data-3d="ah"
                onClick="${() => sendEvent('click', hit, 'pocket clicked')}"
                data-theme="{pocket.theme}"
                data-fill="dark"
                data-flex="v je"
                style="${style}"
              >
                <p class="strong">${hit.name_raw}</p></a
              >`;
            }
          }
        })
      ])
    ]);

    search.start();
  });
</script>

<SiteHeader>
  <h1 slot="left">V2</h1>
</SiteHeader>
<Main padded={false}>
  <Container>
    <h2>Search prototype</h2>
    <div id="search-box" />
  </Container>
  <Container>
    <div data-flex="v" data-gap="1" id="all-results">
      <div data-flex="v" data-gap>
        <h2>Nametags</h2>
        <div id="nametag-hits" />
      </div>
      <div data-flex="v" data-gap>
        <h2>Posts</h2>
        <div id="post-hits" />
      </div>
      <div data-flex="v" data-gap>
        <h2>Pockets</h2>
        <div id="pocket-hits" />
      </div>
    </div>
  </Container>
</Main>

<style lang="scss">
  #nametag-hits :global(.ais-Hits-list),
  #post-hits :global(.ais-Hits-list),
  #pocket-hits :global(.ais-Hits-list) {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
</style>
