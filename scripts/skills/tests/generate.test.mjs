import assert from 'node:assert/strict'
import { test } from 'node:test'
import { renderSkills } from '../lib/generate.mjs'
import { CONFIG, makeRepo } from './fixture.mjs'

test('a domain skill links to the page chapter and quotes its key points', () => {
  const { root } = makeRepo()
  const skill = renderSkills(root).get('.agents/skills/fabnum-code-style/SKILL.md')
  assert.match(skill, /^---\nname: fabnum-code-style\ndescription: "Apply the naming conventions/)
  assert.match(skill, /https:\/\/docs\.example\.org\/nommage#noms-de-branche-git/)
  assert.match(skill, /- Les fichiers sont en kebab-case\./)
  assert.doesNotMatch(skill, /longue explication/)
})

test('the entry skill lists every domain skill', () => {
  const { root } = makeRepo()
  const entry = renderSkills(root).get('.agents/skills/fabnum-conventions/SKILL.md')
  assert.match(entry, /`fabnum-code-style`: Naming rules\./)
})

test('a description with a colon stays valid YAML', () => {
  const config = structuredClone(CONFIG)
  config.skills[0].description = 'Apply the rules: naming, branches. Use when "naming" things.'
  const { root } = makeRepo({ config })
  const skill = renderSkills(root).get('.agents/skills/fabnum-code-style/SKILL.md')
  const line = skill.split('\n').find(l => l.startsWith('description:'))
  assert.equal(JSON.parse(line.slice('description:'.length)), config.skills[0].description)
})
