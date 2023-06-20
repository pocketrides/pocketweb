<script lang="ts">
  import Sheet from '$lib/components/Sheet.svelte';
  import PocketIntro from '$lib/components/pockets/PocketIntro.svelte';
  import type { ServerPocket } from '$lib/zod/Pocket';
  import PocketDisplay from '$lib/components/PocketDisplay.svelte';

  const pockets: ServerPocket[] = [
    {
      id: '123',
      ts: 123,
      nametag: {
        nametag: '',
        theme: 'pink',
        id: '123'
      },
      nametag_ref: { id: '123' },
      members_count: 0,
      name_html: `🎂🎂🎂<br/>Jeremy's Birthday Party`,
      name_raw: `🎂 Jeremy's Birthday`,
      theme: 'lilac',
      details_enabled: ['desc', 'time'],
      hosts: [],
      cover_art: [],
      details: {
        desc_html: `Another trip round the sun!`,
        desc_raw: `Another trip around the sun!`,
        start_date: '2023-02-14',
        start_datetime: '2023-02-14T18:00',
        end_date: '2023-02-14',
        end_datetime: '2023-02-14T22:00',
        all_day: false,
        whenever: false,
        whenever_reason: ''
      },
      settings: {
        joinability: 'anyone',
        visibility: 'listed'
      }
    },
    {
      id: '123',
      ts: 123,
      nametag: {
        nametag: '',
        theme: 'pink',
        id: '123'
      },
      nametag_ref: { id: '123' },
      members_count: 0,
      name_html: `🌁 Trip to SF`,
      name_raw: `🎂 Jeremy's Birthday`,
      theme: 'pink',
      details_enabled: ['time', 'place'],
      hosts: [],
      cover_art: [],
      details: {
        whenever: true,
        whenever_reason: 'Next month',
        place: {
          name: 'San Francisco',
          formatted_address: '123 456'
        }
      },
      settings: {
        joinability: 'anyone',
        visibility: 'listed'
      }
    },
    {
      id: '123',
      ts: 123,
      nametag: {
        nametag: '',
        theme: 'pink',
        id: '123'
      },
      nametag_ref: { id: '123' },
      members_count: 0,
      name_html: `🌲🌎 Earth Day March`,
      name_raw: `🎂 Jeremy's Birthday`,
      theme: 'teal',
      details_enabled: ['place', 'desc'],
      hosts: [],
      cover_art: [],
      details: {
        place: {
          formatted_address: '123',
          name: 'Downtown Fayetteville'
        },
        desc_html: `March for the climate`
      },
      settings: {
        joinability: 'anyone',
        visibility: 'listed'
      }
    },
    {
      id: '123',
      ts: 123,
      nametag: {
        nametag: '',
        theme: 'pink',
        id: '123'
      },
      nametag_ref: { id: '123' },
      members_count: 0,
      name_html: `🖼️ Mary's Art Process`,
      name_raw: ``,
      theme: 'gold',
      details_enabled: ['desc'],
      hosts: [],
      cover_art: [],
      details: {
        desc_html: `Behind the scenes of my process`,
        desc_raw: `Another trip around the sun!`,
        links: [{ url: 'https://shopify.com' }]
      },
      settings: {
        joinability: 'broadcast',
        visibility: 'listed'
      }
    },
    {
      id: '123',
      ts: 123,
      nametag: {
        nametag: '',
        theme: 'pink',
        id: '123'
      },
      nametag_ref: { id: '123' },
      members_count: 0,
      name_html: `PR101 Study Group`,
      name_raw: `March Book Club`,
      theme: 'sky',
      details_enabled: ['desc'],
      hosts: [],
      cover_art: [],
      details: {
        desc_html: `We're reading Elite Capture`,
        desc_raw: ``
      },
      settings: {
        joinability: 'moderated',
        visibility: 'listed'
      }
    }
  ];
</script>

<div style="display: contents">
  <Sheet
    id="pocket_inspiration"
    header="Get inspired"
    icon="face_retouching_natural"
    padded={false}
  >
    <div data-flex="v" data-gap="1">
      <div data-flex="scroll-h" data-gap data-padded>
        {#each pockets as pocket}
          <PocketDisplay {pocket} inert />
        {/each}
      </div>
      <PocketIntro />
    </div>
  </Sheet>
</div>
