# Architecture monorepo

L'approche monorepo consiste à regrouper plusieurs packages ou applications (client, serveur, bibliothèques partagées) dans un seul dépôt Git. Cela facilite le partage de code, la cohérence des versions et l'automatisation des tâches.

La Fabrique Numérique recommande [pnpm workspaces](https://pnpm.io/workspaces) pour la gestion des dépendances et [Turborepo](https://turbo.build/repo) pour l'orchestration des tâches.

## [pnpm workspaces](/monorepo/pnpm)

Configuration des workspaces pnpm pour gérer les dépendances partagées entre packages.

## [Turborepo](/monorepo/turbo)

Orchestration des tâches (build, lint, test) avec cache intelligent et exécution parallèle.

## [Gabarit](/monorepo/gabarit)

Dépôts templates prêts à l'emploi pour démarrer un monorepo.
