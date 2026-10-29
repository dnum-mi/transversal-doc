import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { headingAnchors } from './anchors.mjs'
import { extractKeyPoints } from './keypoints.mjs'

export const SKILLS_DIR = '.agents/skills'
export const MAX_KEY_POINTS = 10

/** Lower-cased text without markdown decoration, to compare prose whatever its formatting. */
export function normalize(text) {
  return text.toLowerCase().replace(/[*_`>#-]/g, ' ').replace(/\s+/g, ' ').trim()
}

export function loadConfig(root) {
  return JSON.parse(readFileSync(join(root, 'scripts/skills/config.json'), 'utf8'))
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true })
    .filter(entry => !entry.name.startsWith('.') && entry.name !== 'node_modules')
    .flatMap(entry => entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)])
}

/** Every markdown page of the documentation, keyed by its path relative to `docs/` (without extension). */
export function loadPages(root) {
  const docs = join(root, 'docs')
  const pages = new Map()
  for (const file of walk(docs).filter(f => f.endsWith('.md'))) {
    const markdown = readFileSync(file, 'utf8')
    pages.set(relative(docs, file).replace(/\.md$/, ''), {
      file: relative(root, file),
      headings: headingAnchors(markdown),
      keyPoints: extractKeyPoints(markdown),
      text: normalize(markdown),
    })
  }
  return pages
}

export function pageUrl(config, page) {
  const path = page === 'index' ? '' : page.replace(/\/index$/, '/')
  return `${config.siteUrl}/${path}`
}

/**
 * Resolves the configuration against the documentation: every skill with its pages, the URL of each chapter
 * and the key points, plus the problems found (unknown page or heading, page without key points).
 */
export function plan(root) {
  const config = loadConfig(root)
  const pages = loadPages(root)
  const problems = []
  const skills = config.skills.map(skill => ({
    ...skill,
    pages: skill.pages.map((entry) => {
      const page = pages.get(entry.page)
      if (!page) {
        problems.push(`${skill.name}: page "${entry.page}" does not exist in docs/`)
        return { ...entry, url: pageUrl(config, entry.page), chapters: [], keyPoints: [] }
      }
      if (!page.keyPoints?.length)
        problems.push(`${page.file}: mapped to ${skill.name} but has no "Points clés" block`)
      else if (page.keyPoints.length > MAX_KEY_POINTS)
        problems.push(`${page.file}: "Points clés" has ${page.keyPoints.length} bullets, ${MAX_KEY_POINTS} at most`)
      const chapters = (entry.chapters ?? []).map((chapter) => {
        const heading = page.headings.find(h => h.title === chapter.heading)
        if (!heading)
          problems.push(`${skill.name}: heading "${chapter.heading}" not found in ${page.file}`)
        const url = pageUrl(config, entry.page)
        return { ...chapter, url: heading ? `${url}#${heading.anchor}` : url }
      })
      return { ...entry, url: pageUrl(config, entry.page), chapters, keyPoints: page.keyPoints ?? [] }
    }),
  }))
  return { config, pages, skills, problems }
}
