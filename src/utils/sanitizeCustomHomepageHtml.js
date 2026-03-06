const FORBIDDEN_TAGS = ['script', 'noscript', 'object', 'embed'];
const JAVASCRIPT_PROTOCOL_PATTERN = /^\s*javascript:/i;

export function sanitizeCustomHomepageHtml(rawHtml) {
  if (typeof rawHtml !== 'string') {
    return '';
  }

  const parser = new DOMParser();
  const documentFragment = parser.parseFromString(rawHtml, 'text/html');

  FORBIDDEN_TAGS.forEach((tagName) => {
    documentFragment.querySelectorAll(tagName).forEach((element) => element.remove());
  });

  documentFragment.querySelectorAll('*').forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      const attributeName = attribute.name.toLowerCase();
      const attributeValue = attribute.value || '';

      if (attributeName.startsWith('on')) {
        element.removeAttribute(attribute.name);
        return;
      }

      if (
        (attributeName === 'href' ||
          attributeName === 'src' ||
          attributeName === 'xlink:href' ||
          attributeName === 'formaction') &&
        JAVASCRIPT_PROTOCOL_PATTERN.test(attributeValue)
      ) {
        element.removeAttribute(attribute.name);
        return;
      }

      if (attributeName === 'srcdoc') {
        element.removeAttribute(attribute.name);
      }
    });
  });

  return documentFragment.body.innerHTML.trim();
}
