import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

export const PAGE_NAMING = [
  '# Conventions de nommage',
  '',
  '::: tip Points clés',
  '- Les branches suivent `<type>/<description>#<ticket>`.',
  '- Les fichiers sont en kebab-case.',
  ':::',
  '',
  '## Noms de branche git',
  '',
  'Une longue explication que le skill ne doit surtout pas recopier telle quelle ici.',
].join('\n')

export const CONFIG = {
  siteUrl: 'https://docs.example.org',
  exclude: [{ pattern: 'index', reason: 'front page' }],
  skills: [{
    name: 'fabnum-code-style',
    title: 'Code style',
    summary: 'Naming rules.',
    description: 'Apply the naming conventions when naming branches, files or variables.',
    pages: [{
      page: 'nommage',
      title: 'Naming',
      when: 'naming a branch, a file or a variable',
      chapters: [{ heading: 'Noms de branche git', when: 'creating a git branch' }],
    }],
  }],
  entry: {
    name: 'fabnum-conventions',
    title: 'Conventions',
    description: 'Entry point: tells which fabnum skill applies to a development task.',
  },
}

/** A throwaway repository: `docs/<page>.md` files plus the skills configuration. */
export function makeRepo({ pages = { 'nommage.md': PAGE_NAMING, 'index.md': '# Home' }, config = CONFIG } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'fabnum-skills-'))
  const write = (file, content) => {
    mkdirSync(dirname(join(root, file)), { recursive: true })
    writeFileSync(join(root, file), content)
  }
  for (const [file, content] of Object.entries(pages))
    write(join('docs', file), content)
  write('scripts/skills/config.json', JSON.stringify(config, null, 2))
  return { root, write }
}
