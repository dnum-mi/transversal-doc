import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { checkSkills } from '../lib/check.mjs'
import { writeSkills } from '../lib/generate.mjs'
import { CONFIG, makeRepo, PAGE_NAMING } from './fixture.mjs'

function generatedRepo(options) {
  const repo = makeRepo(options)
  writeSkills(repo.root)
  return repo
}

function requireSkill(root) {
  return readFileSync(join(root, '.agents/skills/fabnum-code-style/SKILL.md'), 'utf8')
}

test('a freshly generated repository has no problem', () => {
  const { root } = generatedRepo()
  assert.deepEqual(checkSkills(root), [])
})

test('a skill is stale when its page key points changed', () => {
  const { root, write } = generatedRepo()
  write('docs/nommage.md', PAGE_NAMING.replace('kebab-case', 'snake_case'))
  assert.match(checkSkills(root).join('\n'), /fabnum-code-style\/SKILL\.md is out of date/)
})

test('a missing skill file is reported', () => {
  const { root } = makeRepo()
  assert.match(checkSkills(root).join('\n'), /fabnum-code-style\/SKILL\.md is missing/)
})

test('a skill folder unknown to the configuration is reported', () => {
  const { root, write } = generatedRepo()
  write('.agents/skills/fabnum-stray/SKILL.md', '---\nname: fabnum-stray\ndescription: x\n---\n')
  assert.match(checkSkills(root).join('\n'), /fabnum-stray is not in the configuration/)
})

test('a page that is neither mapped nor excluded is reported', () => {
  const { root } = generatedRepo({ pages: { 'nommage.md': PAGE_NAMING, 'index.md': '# Home', 'extra.md': '# Extra' } })
  assert.match(checkSkills(root).join('\n'), /docs\/extra\.md is neither mapped to a skill nor excluded/)
})

test('a mapped page without key points is reported', () => {
  const { root } = makeRepo({ pages: { 'nommage.md': '# Nommage\n\n## Noms de branche git', 'index.md': '# Home' } })
  assert.match(checkSkills(root).join('\n'), /no "Points clés" block/)
})

test('a renamed heading breaks the chapter link', () => {
  const { root } = makeRepo({ pages: { 'nommage.md': PAGE_NAMING.replace('## Noms de branche git', '## Branches'), 'index.md': '# Home' } })
  assert.match(checkSkills(root).join('\n'), /heading "Noms de branche git" not found/)
})

test('an unknown page in the configuration is reported', () => {
  const config = structuredClone(CONFIG)
  config.skills[0].pages[0].page = 'missing'
  const { root } = makeRepo({ config })
  assert.match(checkSkills(root).join('\n'), /page "missing" does not exist/)
})

test('a skill name outside the specification is reported', () => {
  const config = structuredClone(CONFIG)
  config.skills[0].name = 'Fabnum_Code'
  const { root } = makeRepo({ config })
  assert.match(checkSkills(root).join('\n'), /name "Fabnum_Code" must be lowercase letters, digits and single hyphens/)
})

test('an empty or oversized description is reported', () => {
  const config = structuredClone(CONFIG)
  config.skills[0].description = 'x'.repeat(1025)
  config.entry.description = ''
  const { root } = makeRepo({ config })
  const problems = checkSkills(root).join('\n')
  assert.match(problems, /fabnum-code-style: description is longer than 1024 characters/)
  assert.match(problems, /fabnum-conventions: description is empty/)
})

test('a committed link to a missing anchor is reported', () => {
  const { root, write } = generatedRepo()
  write('.agents/skills/fabnum-code-style/SKILL.md', `${requireSkill(root)}\nSee https://docs.example.org/nommage#gone\n`)
  assert.match(checkSkills(root).join('\n'), /link https:\/\/docs\.example\.org\/nommage#gone: no heading "gone"/)
})

test('a committed link to a missing page is reported', () => {
  const { root, write } = generatedRepo()
  write('.agents/skills/fabnum-code-style/SKILL.md', `${requireSkill(root)}\nSee https://docs.example.org/ghost\n`)
  assert.match(checkSkills(root).join('\n'), /link https:\/\/docs\.example\.org\/ghost: no such page/)
})

test('documentation text copied outside the key points is reported', () => {
  const { root, write } = generatedRepo()
  const copied = 'Une longue explication que le skill ne doit surtout pas recopier telle quelle ici.'
  write('.agents/skills/fabnum-code-style/SKILL.md', `${requireSkill(root)}\n${copied}\n`)
  assert.match(checkSkills(root).join('\n'), /fabnum-code-style\/SKILL\.md copies documentation text: "Une longue explication/)
})

test('key points inside the generated markers are not seen as copies', () => {
  const { root } = generatedRepo()
  assert.doesNotMatch(checkSkills(root).join('\n'), /copies documentation text/)
})

test('a key points block with more than 10 bullets is reported', () => {
  const bullets = Array.from({ length: 11 }, (_, i) => `- Règle ${i}.`).join('\n')
  const page = PAGE_NAMING.replace(/- Les branches[\s\S]*?kebab-case\./, bullets)
  const { root } = makeRepo({ pages: { 'nommage.md': page, 'index.md': '# Home' } })
  assert.match(checkSkills(root).join('\n'), /docs\/nommage\.md: "Points clés" has 11 bullets, 10 at most/)
})
