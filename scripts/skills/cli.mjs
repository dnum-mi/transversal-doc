#!/usr/bin/env node
// Usage: node scripts/skills/cli.mjs [--check] [--root <dir>]
// Without options, regenerates the skills; with --check, fails when anything is wrong, and writes nothing.
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkSkills } from './lib/check.mjs'
import { SkillsError } from './lib/errors.mjs'
import { writeSkills } from './lib/generate.mjs'

const args = process.argv.slice(2)
const rootIndex = args.indexOf('--root')
const root = rootIndex === -1 ? fileURLToPath(new URL('../..', import.meta.url)) : resolve(args[rootIndex + 1])

if (args.includes('--check')) {
  const problems = checkSkills(root)
  for (const problem of problems)
    console.error(`- ${problem}`)
  if (problems.length) {
    console.error(`\n${problems.length} problem(s). Fix the docs or the config, then run "pnpm skills:generate".`)
    process.exit(1)
  }
  console.log('Skills are valid and up to date.')
}
else {
  try {
    writeSkills(root)
    console.log('Skills generated.')
  }
  catch (error) {
    if (!(error instanceof SkillsError))
      throw error
    console.error(error.message)
    process.exit(1)
  }
}
