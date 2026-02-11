# Les bibliothèques et frameworks préconisés

## Agent pour le registre npm

- [pnpm](https://pnpm.io)

## Gestion des versions de node

- [proto](https://moonrepo.dev/docs/proto)

Note : Épingler la version de node avec proto ne dispense pas d'indiquer la propriété [`"engines"` dans le `package.json`](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#engines)

## Lint et formattage

- [ESLint](https://eslint.org) cf. [page dédiée](/stack/eslint)
- [Prettier](https://prettier.io) cf. [page dédiée](/stack/prettier)

## Langage

Les projets doivent être écrits en [TypeScript](https://typescriptlang.org/) (cf. [page dédiée](/conventions/typescript)).

## Monorepo

- [pnpm](https://pnpm.io)
- [turborepo](https://turbo.build/repo)

## Scripts npm

- [npm-run-all2](https://github.com/bcomnes/npm-run-all2) (fork maintenu de npm-run-all)

## Dates

Pour les projets qui manipulent des dates, il faut :

- Gérer les fuseaux horaires correctement :

  - stocker et manipuler les dates en temps universel coordonné (UTC) à l'intérieur de votre application, et les convertir en heure locale uniquement pour l'affichage à l'utilisateur
  - utiliser les formats [ISO 8601](https://www.iso.org/fr/iso-8601-date-and-time-format.html) avec les millisecondes (ex :`2018-10-09T08:19:16.999+02:00`)
  - utiliser les fonctionnalités de conversion de fuseau horaire de [date-fns](https://date-fns.org/) pour effectuer ces conversions de manière fiable
- valider et vérifier les dates côté client et côté serveur pour éviter les erreurs et les incohérences

## Client

### Vue et son écosystème

- [Vite](https://vitejs.dev)
- [Vue](https://vuejs.org)
- [VueDsfr](https://vue-dsfr.netlify.app)
- [Pinia](https://pinia.vuejs.org)
- [VueRouter](https://router.vuejs.org)
- [UnoCSS](https://unocss.dev)
- [Oh, Vue Icons!](https://oh-vue-icons.netlify.app/) ou [unocss avec les icones](https://unocss.dev/presets/icons)

### Les tests

- [Vitest](https://vitest.dev) (harnais de tests)
- [Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro/)
- [Jest DOM](https://testing-library.com/docs/ecosystem-jest-dom/) (compatible avec Vitest, donc ne pas utiliser Jest !)
- [Cypress](https://cypress.io) (pour les tests end-to-end et les tests de composants)

### Pour les bibliothèques UI

- [Storybook](https://storybook.js.org)

## Serveur

### web

- [Fastify](https://www.fastify.io) cf. [page dédiée](/serveur/fastify)
- [NestJs](https://nestjs.com) cf. [page dédiée](/serveur/nestjs)
- [Vite-plugin-node](https://github.com/axe-me/vite-plugin-node) idéalement (cf. [ce post pour NestJS](https://blog.logrocket.com/getting-started-with-nestjs-vite-esbuild/))
- [Vitest](https://vitest.dev)
- [supertest](https://github.com/ladjs/supertest)

### ORM

- [Prisma](https://prisma.io/) cf. [page dédiée](/stack/prisma)

### Base de données

- [PostgreSQL](https://hub.docker.com/_/postgres)

## Python

### Gestionnaire de projet

- [uv](https://docs.astral.sh/uv/) (gestion des dépendances, virtualenv, lockfile)

### Framework web

- [FastAPI](https://fastapi.tiangolo.com/) cf. [page dédiée](/serveur/fastapi)

### Lint et formattage

- [Ruff](https://docs.astral.sh/ruff/) (linter et formatter, remplace `black`, `flake8`, `isort`)
