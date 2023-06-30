import type DOMPurify from 'dompurify';

export const dompurify_config: DOMPurify.Config = {
  ALLOWED_TAGS: [
    'br',
    'ul',
    'ol',
    'li',
    'p',
    'strong',
    'em',
    'del',
    'blockquote',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'a',
    'table',
    'thead',
    'tbody',
    'th',
    'tr',
    'td',
    'hr'
  ],
  ALLOWED_ATTR: ['href', 'colspan', 'rowspan'],
  ALLOW_ARIA_ATTR: false,
  ALLOW_DATA_ATTR: false
};

export const dompurify_config_only_text: DOMPurify.Config = {
  ALLOWED_TAGS: ['br'],
  ALLOWED_ATTR: [],
  ALLOW_ARIA_ATTR: false,
  ALLOW_DATA_ATTR: false
};
