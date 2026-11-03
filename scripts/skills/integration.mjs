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
import { SkillsError } from './lib/errors.mjs'
import { loadConfig, SKILLS_DIR } from './lib/plan.mjs'
import { siteLinks } from './lib/urls.mjs'

const ROOT = fileURLToPath(new URL('../..', import.meta.url))
const MAX_OUTPUT_BYTES = 64 * 1024 * 1024
const XDG_FOLDERS = ['config', 'data', 'cache', 'state']

const config = loadConfig(ROOT)
const expected = [config.entry.name, ...config.skills.map(skill => skill.name)].sort()
const work = mkdtempSync(join(tmpdir(), 'fabnum-integration-'))

function run(command, args, { env = {}, cwd = ROOT, shell = false } = {}) {
  const result = spawnSync(command, args, { cwd, env: { ...process.env, ...env }, encoding: 'utf8', maxBuffer: MAX_OUTPUT_BYTES, shell })
  if (result.error?.code === 'ENOENT')
    throw new SkillsError(`"${command}" is not installed`)
  if (result.status !== 0)
    throw new SkillsError(`${command} ${args.join(' ')} failed:\n${result.stdout}${result.stderr}`)
  return result.stdout
}

function expectAllSkills(found, where) {
  const missing = expected.filter(name => !found.includes(name))
  if (missing.length)
    throw new SkillsError(`${where} does not discover: ${missing.join(', ')}`)
}

function skillsRefValidate() {
  if (spawnSync('skills-ref', ['--help']).error?.code === 'ENOENT')
    return 'skipped: skills-ref is not installed, see docs/outils/agents.md'
  for (const name of expected)
    run('skills-ref', ['validate', join(SKILLS_DIR, name)])
}

function claudePluginValidate() {
  run('claude', ['plugin', 'validate', '.', '--strict'])
}

function claudeInstallsPlugin() {
  const env = { CLAUDE_CONFIG_DIR: join(work, 'claude') }
  run('claude', ['plugin', 'marketplace', 'add', ROOT], { env })
  run('claude', ['plugin', 'install', 'fabnum@transversal-doc'], { env })
  const details = run('claude', ['plugin', 'details', 'fabnum@transversal-doc'], { env })
  const line = details.split('\n').find(l => l.trim().startsWith('Skills')) ?? ''
  expectAllSkills(line.replace(/^.*\)\s*/, '').split(',').map(s => s.trim()), 'Claude Code')
}

function opencodeLoadsPlugin() {
  const project = join(work, 'project')
  mkdirSync(project, { recursive: true })
  writeFileSync(join(project, 'opencode.json'), JSON.stringify({ plugin: [`file://${join(ROOT, 'plugin/fabnum.js')}`] }))
  const env = Object.fromEntries(XDG_FOLDERS.map(dir => [`XDG_${dir.toUpperCase()}_HOME`, join(work, 'xdg', dir)]))
  // opencode exits before a pipe is drained: write to a file instead of capturing stdout
  const out = join(work, 'skills.json')
  run('opencode', ['debug', 'skill', '>', out], { cwd: project, env, shell: true })
  expectAllSkills(JSON.parse(readFileSync(out, 'utf8')).map(skill => skill.name), 'opencode')
}

function pageFile(dist, path) {
  return [`${path}.html`, join(path, 'index.html')].map(file => join(dist, file)).find(existsSync)
}

function brokenLinks(dist) {
  return readdirSync(join(ROOT, SKILLS_DIR)).flatMap((name) => {
    const text = readFileSync(join(ROOT, SKILLS_DIR, name, 'SKILL.md'), 'utf8')
    return siteLinks(config.siteUrl, text).filter(({ path, anchor }) => {
      const file = pageFile(dist, path)
      return !file || (anchor && !readFileSync(file, 'utf8').includes(`id="${anchor}"`))
    }).map(({ url }) => url)
  })
}

function linksExistOnBuiltSite() {
  const dist = join(work, 'site')
  run('node', ['node_modules/vitepress/bin/vitepress.js', 'build', 'docs', '--outDir', dist])
  const broken = brokenLinks(dist)
  if (broken.length)
    throw new SkillsError(`links missing on the built site:\n${broken.join('\n')}`)
}

const steps = {
  'skills-ref validate': skillsRefValidate,
  'claude plugin validate': claudePluginValidate,
  'Claude Code installs the plugin and sees every skill': claudeInstallsPlugin,
  'opencode loads the plugin and sees every skill': opencodeLoadsPlugin,
  'every skill link exists on the built site': linksExistOnBuiltSite,
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
