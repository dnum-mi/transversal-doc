const escapeRegExp = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** URL of a documentation page on the published site; `index` pages are served at their folder. */
export function pageUrl(siteUrl, page) {
  const path = page === 'index' ? '' : page.replace(/\/index$/, '/')
  return `${siteUrl}/${path}`
}

/** Every link to the published site found in a text, split into the page path and the heading anchor. */
export function siteLinks(siteUrl, text) {
  const links = text.matchAll(new RegExp(`${escapeRegExp(siteUrl)}/[^\\s)>]*`, 'g'))
  return [...links].map(([url]) => {
    const [path, anchor] = url.slice(siteUrl.length + 1).split('#')
    return { url, path, anchor }
  })
}

/** The page key (path in `docs/` without extension) a site path stands for, among the known keys. */
export function pageKey(path, keys) {
  const key = path.replace(/\/$/, '')
  const candidates = key === '' ? ['index'] : [key, `${key}/index`]
  return candidates.find(candidate => keys.has(candidate))
}
