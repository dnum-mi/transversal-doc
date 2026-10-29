# Les skills pour agents de code

Les **skills** `fabnum-*` permettent à un agent de code (Claude Code, opencode) de suivre les conventions de ce site. Un skill ne recopie pas la documentation : il envoie l'agent vers le bon chapitre de la page de référence, et ne reproduit que le bloc **Points clés** de cette page, généré depuis le texte du site.

## Installation

### Claude Code

```bash
claude plugin marketplace add dnum-mi/transversal-doc
claude plugin install fabnum@transversal-doc
```

### opencode

Déclarer le plugin dans l'`opencode.json` du projet :

```json
{
  "plugin": ["transversal-doc@git+https://github.com/dnum-mi/transversal-doc.git"]
}
```

Dans ce dépôt, les skills sont aussi lus directement depuis `.agents/skills/`.

## Les skills

| Skill | Pages couvertes |
| --- | --- |
| `fabnum-conventions` | Point d'entrée : indique quel skill s'applique à la tâche |
| `fabnum-code-style` | Nommage, TypeScript, bonnes pratiques de code, lint et formattage |
| `fabnum-project-structure` | Architecture des dossiers, monorepo (pnpm, Turborepo) |
| `fabnum-rest-api` | API RESTful |
| `fabnum-project-docs` | Documentation des projets |
| `fabnum-poc-to-prod` | Du POC à la production |
| `fabnum-deployment` | Déploiement (Docker, Helm, Cloud Pi Native) |
| `fabnum-cicd` | CI/CD et workflows réutilisables |
| `fabnum-stack` | Stack technique (ESLint, Prettier, Prisma, REST Client) |
| `fabnum-server` | Recettes serveur (NestJS, Fastify, FastAPI) |
| `fabnum-client` | Recettes client (Vue 3, Nuxt 3, Toaster) |

La liste exacte et les pages routées par chaque skill sont dans `scripts/skills/config.json`. Les pages d'installation et d'outils n'ont pas de skill.

## Modifier ou ajouter un skill

Les fichiers `.agents/skills/*/SKILL.md` sont **générés** : ne pas les modifier à la main.

1. Dans la page de référence, écrire ou mettre à jour le bloc `::: tip Points clés` (10 puces au plus, une ligne chacune, en français).
2. Dans `scripts/skills/config.json`, ajouter la page à un skill (ou créer le skill), avec les chapitres vers lesquels router. Une page qui n'est ni associée à un skill ni exclue fait échouer la vérification.
3. Régénérer et vérifier :

```bash
pnpm skills:generate   # écrit les skills
pnpm skills:check      # skills à jour, liens valides, couverture, pas de texte recopié
pnpm test:skills       # tests, sans réseau
```

La CI exécute `skills:check` et les tests. Renommer un titre de la documentation fait échouer la vérification tant que la configuration n'est pas mise à jour.

## Vérifications lentes

```bash
pnpm test:skills:integration
```

Ce script installe le plugin dans un environnement jetable, vérifie que Claude Code et opencode voient tous les skills, valide le manifeste (`claude plugin validate`) et contrôle chaque lien contre un build du site. Il utilise aussi le validateur officiel `skills-ref` s'il est installé :

```bash
uv tool install "git+https://github.com/agentskills/agentskills#subdirectory=skills-ref"
```

## Évaluer le déclenchement

Le choix du bon skill par l'agent dépend d'un modèle de langage : il n'est pas testé automatiquement. Pour le vérifier ou ajuster les descriptions, utiliser le skill `skill-creator` sur un skill, avec les phrases de `scripts/skills/evals/prompts.json` (chaque entrée indique le skill attendu). Ajouter une phrase à chaque nouveau skill.
