// Génère la liste des hashes CSP des scripts inline du site buildé.
//
// VitePress injecte des scripts inline dans chaque page (thème sombre, plateforme, hashmap des routes)
// dont le contenu change à chaque build. Plutôt que d'autoriser 'unsafe-inline' dans la CSP, on calcule
// leurs hashes après le build et nginx les expose via la variable $csp_script_hashes (cf. nginx.conf).
//
// Usage : node scripts/csp-hashes.mjs <dossier-dist> <fichier-nginx-de-sortie>

import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const [distDir, outFile] = process.argv.slice(2)
if (!distDir || !outFile) {
  console.error('Usage: node scripts/csp-hashes.mjs <dist-dir> <out-file>')
  process.exit(1)
}

const htmlFiles = readdirSync(distDir, { recursive: true }).filter(file => file.endsWith('.html'))
if (!htmlFiles.length) {
  console.error(`No html file found in ${distDir}, was the site built?`)
  process.exit(1)
}

const inlineScript = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/gi
const hashes = new Set()
for (const file of htmlFiles) {
  for (const [, content] of readFileSync(join(distDir, file), 'utf8').matchAll(inlineScript)) {
    if (content.trim()) {
      hashes.add(`'sha256-${createHash('sha256').update(content).digest('base64')}'`)
    }
  }
}

const sorted = [...hashes].sort().join(' ')
writeFileSync(outFile, `# Généré par scripts/csp-hashes.mjs, ne pas modifier.
map $host $csp_script_hashes {
  default "${sorted}";
}
`)
console.log(`${hashes.size} inline script hash(es) from ${htmlFiles.length} page(s) written to ${outFile}`)
