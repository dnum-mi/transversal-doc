/**
 * opencode plugin of the Fabrique Numérique conventions skills.
 *
 * Declare it in the opencode.json of a project, optionally pinned to a release tag:
 *
 *   "plugin": ["transversal-doc@git+https://github.com/dnum-mi/transversal-doc.git"]
 *
 * It only registers the skills folder of this repository: the skills themselves follow the
 * Agent Skills specification and are generated from the documentation (see scripts/skills).
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SKILLS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.agents/skills')

export const FabnumPlugin = async () => ({
  config: async (config) => {
    config.skills ??= {}
    config.skills.paths ??= []
    if (!config.skills.paths.includes(SKILLS))
      config.skills.paths.push(SKILLS)
  },
})
