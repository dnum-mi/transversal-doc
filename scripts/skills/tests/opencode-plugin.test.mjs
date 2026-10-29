import assert from 'node:assert/strict'
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { FabnumPlugin } from '../../../plugin/fabnum.js'

async function configure(config = {}) {
  const hooks = await FabnumPlugin({})
  await hooks.config(config)
  return config
}

test('the opencode plugin registers the skills folder, once, and keeps existing paths', async () => {
  const config = await configure({ skills: { paths: ['/somewhere/else'] } })
  await configure(config)
  assert.equal(config.skills.paths.length, 2)
  assert.equal(config.skills.paths[0], '/somewhere/else')
  const [, registered] = config.skills.paths
  assert.ok(registered.endsWith('.agents/skills'))
  const skills = readdirSync(registered).filter(name => existsSync(join(registered, name, 'SKILL.md')))
  assert.ok(skills.includes('fabnum-conventions'))
})
