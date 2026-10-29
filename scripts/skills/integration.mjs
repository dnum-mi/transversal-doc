#!/usr/bin/env node
// Slow checks that need the real tools: nothing here runs in the fast unit tests.
// Every step works in a throwaway directory and never touches the user's Claude Code or opencode setup.
//
//   node scripts/skills/integration.mjs
//
// Steps: official validators (skills-ref when installed, "claude plugin validate"), installation of the plugin in
// Claude Code, discovery by opencode, and every skill link against the built site.
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadConfig, SKILLS_DIR } from './lib/plan.mjs'

const ROOT = fileURLToPath(new URL('../..', import.meta.url))
const config = loadConfig(ROOT)
const expected = [config.entry.name, ...config.skills.map(skill => skill.name)].sort()
const work = mkdtempSync(join(tmpdir(), 'fabnum-integration-'))

function run(command, args, { env = {}, cwd = ROOT } = {}) {
  const result = spawnSync(command, args, { cwd, env: { ...process.env, ...env }, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  if (result.error?.code === 'ENOENT')
    throw new Error(`"${command}" is not installed`)
  if (result.status !== 0)
    throw new Error(`${command} ${args.join(' ')} failed:\n${result.stdout}${result.stderr}`)
  return result.stdout
}

function sameSkills(found, where) {
  const missing = expected.filter(name => !found.includes(name))
  if (missing.length)
    throw new Error(`${where} does not discover: ${missing.join(', ')}`)
}

const steps = {
  'skills-ref validate': () => {
    const which = spawnSync('skills-ref', ['--help'], { encoding: 'utf8' })
    if (which.error?.code === 'ENOENT')
      return 'skipped: skills-ref is not installed (see docs/outils/agents.md)'
    for (const name of expected)
      run('skills-ref', ['validate', join(SKILLS_DIR, name)])
  },
  'claude plugin validate': () => {
    run('claude', ['plugin', 'validate', '.', '--strict'])
  },
  'Claude Code installs the plugin and sees every skill': () => {
    const env = { CLAUDE_CONFIG_DIR: join(work, 'claude') }
    run('claude', ['plugin', 'marketplace', 'add', ROOT], { env })
    run('claude', ['plugin', 'install', 'fabnum@transversal-doc'], { env })
    const details = run('claude', ['plugin', 'details', 'fabnum@transversal-doc'], { env })
    const line = details.split('\n').find(l => l.trim().startsWith('Skills'))
    sameSkills((line ?? '').replace(/^.*\)\s*/, '').split(',').map(s => s.trim()), 'Claude Code')
  },
  'opencode loads the plugin and sees every skill': () => {
    const project = join(work, 'project')
    mkdirSync(project, { recursive: true })
    writeFileSync(join(project, 'opencode.json'), JSON.stringify({ plugin: [`file://${join(ROOT, 'plugin/fabnum.js')}`] }))
    const env = Object.fromEntries(['config', 'data', 'cache', 'state'].map(dir => [`XDG_${dir.toUpperCase()}_HOME`, join(work, 'xdg', dir)]))
    // opencode exits before a pipe is drained: write to a file instead of capturing stdout
    const out = join(work, 'skills.json')
    spawnSync('sh', ['-c', `opencode debug skill > "${out}"`], { cwd: project, env: { ...process.env, ...env } })
    sameSkills(JSON.parse(readFileSync(out, 'utf8')).map(skill => skill.name), 'opencode')
  },
  'every skill link exists on the built site': () => {
    const dist = join(work, 'site')
    run('node', ['node_modules/vitepress/bin/vitepress.js', 'build', 'docs', '--outDir', dist])
    const bad = []
    for (const name of readdirSync(join(ROOT, SKILLS_DIR))) {
      const text = readFileSync(join(ROOT, SKILLS_DIR, name, 'SKILL.md'), 'utf8')
      for (const [url] of text.matchAll(new RegExp(`${config.siteUrl.replace(/\./g, '\\.')}/[^\\s)]*`, 'g'))) {
        const [path, anchor] = url.slice(config.siteUrl.length + 1).split('#')
        const file = [`${path}.html`, join(path, 'index.html')].map(f => join(dist, f)).find(existsSync)
        if (!file || (anchor && !readFileSync(file, 'utf8').includes(`id="${anchor}"`)))
          bad.push(url)
      }
    }
    if (bad.length)
      throw new Error(`links missing on the built site:\n${bad.join('\n')}`)
  },
}

let failed = false
for (const [title, step] of Object.entries(steps)) {
  try {
    const note = step()
    console.log(`ok   ${title}${note ? ` (${note})` : ''}`)
  }
  catch (error) {
    failed = true
    console.error(`FAIL ${title}\n${error.message}`)
  }
}
rmSync(work, { recursive: true, force: true })
process.exit(failed ? 1 : 0)
