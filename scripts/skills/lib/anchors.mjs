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

/** The heading lines of a page, leaving out whatever sits inside a code fence. */
function headingLines(markdown) {
  const lines = []
  let fence = null
  for (const line of markdown.split('\n')) {
    const marker = line.match(/^\s*(```+|~~~+)/)
    if (marker)
      fence = fence ? (marker[1].startsWith(fence) ? null : fence) : marker[1]
    else if (!fence)
      lines.push(line)
  }
  return lines.map(line => line.match(/^(#{1,6})\s+(.*?)\s*$/)).filter(Boolean)
}

/** Headings of a markdown page with the anchor the site gives them: `[{ level, title, anchor }]`. */
export function headingAnchors(markdown) {
  const used = new Map()
  return headingLines(markdown).map(([, hashes, raw]) => {
    const custom = raw.match(/^(.*?)\s*\{#([^}\s]+)\}$/)
    const title = plainTitle(custom ? custom[1] : raw)
    const base = custom ? custom[2] : slugify(title)
    const count = used.get(base) ?? 0
    used.set(base, count + 1)
    return { level: hashes.length, title, anchor: count ? `${base}-${count}` : base }
  })
}
