const OPENING = /^:::\s*tip\s+Points clés\s*$/
const CLOSING = /^:::\s*$/

/** The bullets of the "Points clés" container of a page, or `null` when the page has none. */
export function extractKeyPoints(markdown) {
  const lines = markdown.split('\n')
  const start = lines.findIndex(line => OPENING.test(line))
  if (start === -1)
    return null
  const bullets = []
  for (const line of lines.slice(start + 1)) {
    if (CLOSING.test(line))
      break
    if (line.startsWith('- '))
      bullets.push(line.slice(2).trim())
  }
  return bullets
}
