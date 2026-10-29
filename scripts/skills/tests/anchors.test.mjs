import assert from 'node:assert/strict'
import { test } from 'node:test'
import { headingAnchors } from '../lib/anchors.mjs'

test('anchors follow the site slug rules (accents, code, punctuation)', () => {
  const md = [
    '# Conventions de nommage',
    '## Noms de branche git',
    '### Le nom de la branche par défaut devrait être `main`',
    '## Message de validation (*commit*)',
    '## 1. Architecture & structure',
  ].join('\n')
  assert.deepEqual(headingAnchors(md).map(h => h.anchor), [
    'conventions-de-nommage',
    'noms-de-branche-git',
    'le-nom-de-la-branche-par-defaut-devrait-etre-main',
    'message-de-validation-commit',
    '_1-architecture-structure',
  ])
})

test('anchors ignore headings inside code fences and number duplicates', () => {
  const md = ['## Logs', '```bash', '# not a heading', '```', '## Logs'].join('\n')
  assert.deepEqual(headingAnchors(md).map(h => h.anchor), ['logs', 'logs-1'])
})

test('anchors keep the title text and honour explicit ids and links', () => {
  const md = '## [`pnpm`](https://pnpm.io) {#custom}'
  assert.deepEqual(headingAnchors(md), [{ level: 2, title: 'pnpm', anchor: 'custom' }])
})
