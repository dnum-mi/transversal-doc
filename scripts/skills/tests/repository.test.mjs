import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { checkSkills } from '../lib/check.mjs'

const ROOT = fileURLToPath(new URL('../../..', import.meta.url))

test('the skills committed in this repository are valid and up to date with the documentation', () => {
  assert.deepEqual(checkSkills(ROOT), [])
})

const config = JSON.parse(readFileSync(join(ROOT, 'scripts/skills/config.json'), 'utf8'))
const skillNames = [config.entry.name, ...config.skills.map(skill => skill.name)]

test('the site page about agent skills names every skill', () => {
  const page = readFileSync(join(ROOT, 'docs/outils/agents.md'), 'utf8')
  for (const name of skillNames)
    assert.ok(page.includes(`\`${name}\``), `docs/outils/agents.md does not mention ${name}`)
})

test('every trigger evaluation prompt expects an existing skill, and every skill has a prompt', () => {
  const cases = JSON.parse(readFileSync(join(ROOT, 'scripts/skills/evals/prompts.json'), 'utf8'))
  for (const { prompt, expected } of cases) {
    assert.ok(prompt.length > 10)
    assert.ok(skillNames.includes(expected), `unknown skill ${expected}`)
  }
  for (const name of skillNames)
    assert.ok(cases.some(({ expected }) => expected === name), `no evaluation prompt for ${name}`)
})

test('the plugin version follows the repository version', () => {
  const { version } = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))
  const marketplace = JSON.parse(readFileSync(join(ROOT, '.claude-plugin/marketplace.json'), 'utf8'))
  assert.equal(marketplace.plugins[0].version, version)
  const release = JSON.parse(readFileSync(join(ROOT, 'release-please-config.json'), 'utf8'))
  const tracked = release.packages['.']['extra-files'].map(file => file.path ?? file)
  assert.ok(tracked.includes('.claude-plugin/marketplace.json'), 'release-please does not bump the marketplace version')
})
