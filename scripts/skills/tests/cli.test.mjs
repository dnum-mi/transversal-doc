import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { makeRepo } from './fixture.mjs'

const CLI = fileURLToPath(new URL('../cli.mjs', import.meta.url))
const run = (root, ...args) => spawnSync('node', [CLI, '--root', root, ...args], { encoding: 'utf8' })

test('check fails on a repository whose skills were never generated, generate then fixes it', () => {
  const { root } = makeRepo()
  const failing = run(root, '--check')
  assert.equal(failing.status, 1)
  assert.match(failing.stderr, /is missing/)

  assert.equal(run(root).status, 0)
  assert.ok(existsSync(join(root, '.agents/skills/fabnum-code-style/SKILL.md')))
  assert.equal(run(root, '--check').status, 0)
})
