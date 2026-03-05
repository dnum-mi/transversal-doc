# transversal-doc — CoFabNum

Documentation transversale des projets de la **Fabrique Numérique** (DNUM/MI), regroupant les conventions, bonnes pratiques et guides techniques partagés entre les équipes de développement.

Le site est généré avec [VitePress](https://vitepress.dev) et accessible en interne.

## Objectif

Ce dépôt centralise les référentiels communs aux projets de la Fabrique Numérique :

- **Conventions** – nommage, architecture des dossiers, TypeScript, API RESTful, lint et formattage.
- **Stack technique** – bibliothèques et outils recommandés (ESLint, Prettier, Prisma, Vitest, Playwright, etc.).
- **Recettes** – guides de démarrage pour Vue 3, Nuxt 3, NestJS, Fastify et FastAPI.
- **Environnement de travail** – installation et configuration de la machine de développement (Windows, macOS, Ubuntu).
- **Monorepo** – configuration pnpm workspaces et Turborepo.
- **CI/CD** – principes et exemples de pipelines GitHub Actions.

## Démarrage rapide

> Prérequis : [Node.js](https://nodejs.org) et [pnpm](https://pnpm.io)

```bash
# Installer les dépendances
pnpm install

# Lancer le serveur de développement (http://localhost:5172)
pnpm dev

# Générer le site statique
pnpm build

# Prévisualiser le build
pnpm preview
```

## Docker

```bash
# Construire l'image
pnpm docker:build

# Lancer le conteneur (http://localhost:8080)
pnpm docker:run
```

## Structure

```
docs/          # Sources de la documentation (Markdown + VitePress)
helm/          # Chart Helm pour le déploiement Kubernetes
Dockerfile     # Image de production (nginx)
nginx.conf     # Configuration nginx
```

## Contribuer

Toute contribution est la bienvenue. Pour proposer une modification, ouvrez une pull request en suivant les [conventions de contribution](/docs/conventions/index.md) décrites dans la documentation elle-même.
