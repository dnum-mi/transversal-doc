import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { KEY_POINTS_END } from './generate.mjs'
import { normalize, SKILLS_DIR } from './plan.mjs'

const NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/
const MIN_COPIED_LENGTH = 40
const MAX_BODY_LINES = 500

function nameProblems(label, name) {
  if (!NAME.test(name) || name.length > 64)
    return [`${label}: name "${name}" must be lowercase letters, digits and single hyphens, 64 characters at most`]
  return []
}

function descriptionProblems(label, description) {
  if (!description)
    return [`${label}: description is empty`]
  return description.length > 1024 ? [`${label}: description is longer than 1024 characters`] : []
}

/** The Agent Skills rules that depend on the configuration only, so they fail before anything is generated. */
export function configProblems(config) {
  return [config.entry, ...config.skills].flatMap(({ name, description }) =>
    [...nameProblems(name, name), ...descriptionProblems(name, description)])
}

function parseSkill(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match)
    return null
  const fields = Object.fromEntries(match[1].split('\n').map(line => [line.slice(0, line.indexOf(':')), line.slice(line.indexOf(':') + 1).trim()]))
  return { fields, body: match[2] }
}

function withoutKeyPoints(body) {
  return body.replace(new RegExp(`<!-- key-points:start [^>]*-->[\\s\\S]*?${KEY_POINTS_END}`, 'g'), '')
}

function linkProblems(file, body, { config, pages }) {
  const problems = []
  const prefix = `${config.siteUrl}/`
  for (const [url] of body.matchAll(new RegExp(`${prefix.replace(/[.]/g, '\\.')}[^\\s)>]*`, 'g'))) {
    const [path, anchor] = url.slice(prefix.length).split('#')
    const key = path.replace(/\/$/, '')
    const page = pages.get(key) ?? pages.get(`${key}/index`.replace(/^\//, '')) ?? (key === '' ? pages.get('index') : undefined)
    if (!page)
      problems.push(`${file}: link ${url}: no such page`)
    else if (anchor && !page.headings.some(h => h.anchor === anchor))
      problems.push(`${file}: link ${url}: no heading "${anchor}" in ${page.file}`)
  }
  return problems
}

function copyProblems(file, body, { pages }) {
  const corpus = [...pages.values()].map(page => page.text)
  return withoutKeyPoints(body).split('\n')
    .filter(line => normalize(line).length >= MIN_COPIED_LENGTH && corpus.some(text => text.includes(normalize(line))))
    .map(line => `${file} copies documentation text: "${line.trim().slice(0, 50)}…"`)
}

/** Checks the committed skills as an agent would read them: valid files, live links, no duplicated documentation. */
export function committedSkillProblems(root, resolved) {
  const dir = join(root, SKILLS_DIR)
  const problems = []
  for (const folder of existsSync(dir) ? readdirSync(dir) : []) {
    const file = `${SKILLS_DIR}/${folder}/SKILL.md`
    if (!existsSync(join(root, file)))
      continue
    const skill = parseSkill(readFileSync(join(root, file), 'utf8'))
    if (!skill) {
      problems.push(`${file}: frontmatter is missing`)
      continue
    }
    if (skill.fields.name !== folder)
      problems.push(`${file}: name "${skill.fields.name}" does not match folder "${folder}"`)
    if (skill.body.split('\n').length > MAX_BODY_LINES)
      problems.push(`${file}: body is longer than ${MAX_BODY_LINES} lines`)
    problems.push(...linkProblems(file, skill.body, resolved), ...copyProblems(file, skill.body, resolved))
  }
  return problems
}
