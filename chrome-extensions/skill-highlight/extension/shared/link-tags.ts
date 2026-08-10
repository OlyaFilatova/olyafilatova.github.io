export function getLinks(selector: string): string[] {
  const linkTags = [...document.querySelectorAll<HTMLAnchorElement>(selector)];
    
  return linkTags.map(el => el.getAttribute('href')).map(href => href && (href => {
    const url = new URL(href, window.location.origin);
    url.search = '';
    return url.toString();
  })(href)).filter((href): href is string => Boolean(href));
}

export function stylizeVisitedLinks(selector: string, visitedLinks: string[]) {
  const linkTags = [...document.querySelectorAll(selector)];

  linkTags.forEach(linkTag => {
    const link = linkTag.getAttribute('href');

    if (link) {
      const url = new URL(link, window.location.origin);
      url.search = '';

      if (visitedLinks.includes(url.toString())) {
        linkTag.classList.add('is-visited')
      }
    }
  });
}
