import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { withoutKeyPoints } from './markers.mjs'
import { normalize, SKILLS_DIR } from './plan.mjs'
import { pageKey, siteLinks } from './urls.mjs'

const NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/
const MAX_NAME_LENGTH = 64
const MAX_DESCRIPTION_LENGTH = 1024
const MAX_BODY_LINES = 500
const MIN_COPIED_LENGTH = 40

function nameProblems(name) {
  if (!NAME.test(name) || name.length > MAX_NAME_LENGTH)
    return [`${name}: name "${name}" must be lowercase letters, digits and single hyphens, ${MAX_NAME_LENGTH} characters at most`]
  return []
}

function descriptionProblems(name, description) {
  if (!description)
    return [`${name}: description is empty`]
  return description.length > MAX_DESCRIPTION_LENGTH ? [`${name}: description is longer than ${MAX_DESCRIPTION_LENGTH} characters`] : []
}

/** The Agent Skills rules that depend on the configuration only, so they fail before anything is generated. */
export function configProblems(config) {
  return [config.entry, ...config.skills].flatMap(({ name, description }) =>
    [...nameProblems(name), ...descriptionProblems(name, description)])
}

function parseSkill(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match)
    return null
  const fields = Object.fromEntries(match[1].split('\n').map((line) => {
    const colon = line.indexOf(':')
    return [line.slice(0, colon), line.slice(colon + 1).trim()]
  }))
  return { fields, body: match[2] }
}

function linkProblems(file, body, { config, pages }) {
  return siteLinks(config.siteUrl, body).flatMap(({ url, path, anchor }) => {
    const key = pageKey(path, new Set(pages.keys()))
    if (!key)
      return [`${file}: link ${url}: no such page`]
    const missing = anchor && !pages.get(key).headings.some(h => h.anchor === anchor)
    return missing ? [`${file}: link ${url}: no heading "${anchor}" in ${pages.get(key).file}`] : []
  })
}

function copyProblems(file, body, { pages }) {
  const corpus = [...pages.values()].map(page => page.text)
  return withoutKeyPoints(body).split('\n')
    .filter(line => normalize(line).length >= MIN_COPIED_LENGTH && corpus.some(text => text.includes(normalize(line))))
    .map(line => `${file} copies documentation text: "${line.trim().slice(0, 50)}…"`)
}

function skillFileProblems(file, folder, text, resolved) {
  const skill = parseSkill(text)
  if (!skill)
    return [`${file}: frontmatter is missing`]
  const problems = []
  if (skill.fields.name !== folder)
    problems.push(`${file}: name "${skill.fields.name}" does not match folder "${folder}"`)
  if (skill.body.split('\n').length > MAX_BODY_LINES)
    problems.push(`${file}: body is longer than ${MAX_BODY_LINES} lines`)
  return [...problems, ...linkProblems(file, skill.body, resolved), ...copyProblems(file, skill.body, resolved)]
}

/** Checks the committed skills as an agent would read them: valid files, live links, no duplicated documentation. */
export function committedSkillProblems(root, resolved) {
  const dir = join(root, SKILLS_DIR)
  return (existsSync(dir) ? readdirSync(dir) : []).flatMap((folder) => {
    const file = `${SKILLS_DIR}/${folder}/SKILL.md`
    return existsSync(join(root, file)) ? skillFileProblems(file, folder, readFileSync(join(root, file), 'utf8'), resolved) : []
  })
}
