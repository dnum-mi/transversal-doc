import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { committedSkillProblems, configProblems } from './conformance.mjs'
import { renderSkills } from './generate.mjs'
import { SKILLS_DIR, plan } from './plan.mjs'

function globToRegExp(pattern) {
  const source = pattern
    .split('**').map(part => part.split('*').map(p => p.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('[^/]*')).join('.*')
  return new RegExp(`^${source}$`)
}

function coverageProblems({ config, pages, skills }) {
  const mapped = new Set(skills.flatMap(skill => skill.pages.map(entry => entry.page)))
  const excluded = config.exclude.map(({ pattern }) => globToRegExp(pattern))
  return [...pages]
    .filter(([key]) => !mapped.has(key) && !excluded.some(re => re.test(key)))
    .map(([, page]) => `${page.file} is neither mapped to a skill nor excluded`)
}

function freshnessProblems(root, config) {
  const problems = []
  const expected = renderSkills(root)
  for (const [file, content] of expected) {
    if (!existsSync(join(root, file)))
      problems.push(`${file} is missing, run the generator`)
    else if (readFileSync(join(root, file), 'utf8') !== content)
      problems.push(`${file} is out of date, run the generator`)
  }
  const known = new Set([...config.skills.map(s => s.name), config.entry.name])
  const dir = join(root, SKILLS_DIR)
  for (const name of existsSync(dir) ? readdirSync(dir) : []) {
    if (!known.has(name))
      problems.push(`${SKILLS_DIR}/${name} is not in the configuration`)
  }
  return problems
}

/** Every reason why the committed skills cannot be trusted; an empty list means they are good to ship. */
export function checkSkills(root) {
  const resolved = plan(root)
  const problems = [...configProblems(resolved.config), ...resolved.problems, ...coverageProblems(resolved)]
  if (!resolved.problems.length)
    problems.push(...freshnessProblems(root, resolved.config))
  return [...problems, ...committedSkillProblems(root, resolved)]
}
