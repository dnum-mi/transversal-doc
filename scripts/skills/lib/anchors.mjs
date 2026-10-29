// Same slug rules as the site generator (VitePress), so that a link built here lands on the real heading.
const CONTROL = /[\u0000-\u001F]/g
const SPECIAL = /[\s~`!@#$%^&*()\-_+=[\]{}|\;:"'“”‘’<>,.?/]+/g
const COMBINING = /[̀-ͯ]/g

export function slugify(text) {
  return text
    .normalize('NFKD')
    .replace(COMBINING, '')
    .replace(CONTROL, '')
    .replace(SPECIAL, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/^(\d)/, '_$1')
    .toLowerCase()
}

function plainTitle(raw) {
  return raw
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    .trim()
}

/** Headings of a markdown page with the anchor the site gives them: `[{ level, title, anchor }]`. */
export function headingAnchors(markdown) {
  const headings = []
  const used = new Map()
  let fence = null
  for (const line of markdown.split('\n')) {
    const marker = line.match(/^\s*(```+|~~~+)/)
    if (marker) {
      if (!fence)
        fence = marker[1]
      else if (marker[1].startsWith(fence))
        fence = null
      continue
    }
    const match = !fence && line.match(/^(#{1,6})\s+(.*?)\s*$/)
    if (!match)
      continue
    const custom = match[2].match(/^(.*?)\s*\{#([^}\s]+)\}$/)
    const title = plainTitle(custom ? custom[1] : match[2])
    const base = custom ? custom[2] : slugify(title)
    const count = used.get(base) ?? 0
    used.set(base, count + 1)
    headings.push({ level: match[1].length, title, anchor: count ? `${base}-${count}` : base })
  }
  return headings
}
