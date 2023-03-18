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
    'h6'
  ],
  ALLOWED_ATTR: [],
  ALLOW_ARIA_ATTR: false,
  ALLOW_DATA_ATTR: false
};
