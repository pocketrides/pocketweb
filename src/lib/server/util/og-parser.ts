type MetaHandlerData = {
  og_image?: string;
  og_title?: string;
  og_desc?: string;
};

class MetaHandler {
  data: MetaHandlerData = {
    og_image: undefined,
    og_title: undefined,
    og_desc: undefined
  };

  element(el: Element) {
    if (
      el.getAttribute('property') === 'og:image' ||
      el.getAttribute('name') === 'og:image'
    ) {
      this.data.og_image = el.getAttribute('content') || undefined;

      if (this.data.og_image)
        this.data.og_image = this.data.og_image
          .replace(/&amp;/g, '&')
          .replace(/^http:/, 'https:');
    }

    if (
      el.getAttribute('property') === 'og:description' ||
      el.getAttribute('name') === 'og:description'
    )
      this.data.og_desc = el.getAttribute('content') || undefined;

    if (
      el.getAttribute('property') === 'og:title' ||
      el.getAttribute('name') === 'og:title'
    )
      this.data.og_title = el.getAttribute('content') || undefined;
  }
}

export const parseOpenGraphTags = async (
  body: Response
): Promise<MetaHandlerData | undefined> => {
  if (typeof HTMLRewriter === 'undefined') return undefined;

  const meta_handler = new MetaHandler();

  const res = new HTMLRewriter().on('meta', meta_handler).transform(body);
  await res.text();

  return meta_handler.data;
};

export const GOOGLEBOT_UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36 Google Favicon';
