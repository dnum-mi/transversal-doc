# [Turborepo](http://turbo.build/repo)

[Turborepo](https://turbo.build/repo) est un outil de build intelligent pour les monorepos JavaScript/TypeScript. Il optimise l'exécution des tâches grâce à un système de cache et de parallélisation.

## Pourquoi Turborepo

- **Cache intelligent** : Turborepo mémorise les résultats des tâches déjà exécutées et les réutilise si les fichiers sources n'ont pas changé.
- **Parallélisation** : Les tâches indépendantes sont exécutées en parallèle automatiquement.
- **Graphe de dépendances** : Turborepo comprend les dépendances entre les packages du monorepo et exécute les tâches dans le bon ordre.

## Installation

```shell
pnpm add -Dw turbo
```

## Configuration `turbo.json`

Le fichier `turbo.json` à la racine du monorepo définit les pipelines de tâches :

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["build"]
    },
    "test:ct": {
      "dependsOn": ["build"],
      "cache": false
    }
  }
}
```

### Explication des propriétés

- **`dependsOn`** : liste des tâches qui doivent être exécutées avant celle-ci.
  - `^build` signifie « le `build` de toutes les dépendances internes du package ».
  - `build` (sans `^`) signifie « le `build` du même package ».
- **`outputs`** : les dossiers/fichiers produits par la tâche, qui seront mis en cache.
- **`cache`** : `false` pour désactiver le cache (utile pour `dev` ou les tests e2e).
- **`persistent`** : `true` pour les tâches longues (serveurs de dev).

## Commandes courantes

```shell
# Lancer le build de tous les packages
pnpm turbo build

# Lancer le dev de tous les packages
pnpm turbo dev

# Lancer le lint uniquement sur les packages modifiés
pnpm turbo lint --filter=...[HEAD^1]

# Lancer une tâche sur un package spécifique
pnpm turbo build --filter=@monorepo/api

# Lancer une tâche sur un package et ses dépendances
pnpm turbo build --filter=@monorepo/api...
```

## Bonnes pratiques

- Ajouter `.turbo` au `.gitignore` (dossier de cache local).
- Définir des `outputs` précis pour chaque tâche afin d'optimiser le cache.
- Utiliser `--filter` en CI pour ne lancer les tâches que sur les packages impactés par une PR.

## Intégration dans `package.json`

Ajouter les scripts Turborepo dans le `package.json` racine :

```json
{
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "test": "turbo test"
  }
}
```
