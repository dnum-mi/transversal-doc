---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "CoFabNum"
  text: "Conventions des projets de la Fabrique Numérique"
  tagline: Les bonnes pratiques et conventions pour garantir un haut niveau de qualité dans les projets
  actions:
    - theme: brand
      text: Commencer ici
      link: /ce-document
    - theme: alt
      text: Conventions
      link: /conventions/
    - theme: alt
      text: Stack technique
      link: /stack/

features:
  - title: Conventions
    details: Nommage, architecture, TypeScript, API RESTful, lint, formattage — des règles partagées pour tous les projets.
    link: /conventions/
    linkText: Voir les conventions
  - title: Stack technique
    details: Les bibliothèques, frameworks et outils recommandés (ESLint, Prettier, Prisma, Vitest, etc.).
    link: /stack/
    linkText: Voir la stack
  - title: Recettes
    details: Guides concrets pour démarrer un projet Vue 3, Nuxt 3, NestJS, Fastify ou FastAPI.
    link: /serveur/
    linkText: Voir les recettes
  - title: Environnement de travail
    details: Installation et configuration de la machine de développement (Windows, macOS, Ubuntu).
    link: /outils/
    linkText: Voir les installations
  - title: Monorepo
    details: Configuration pnpm workspaces et Turborepo pour les projets multi-packages.
    link: /monorepo/
    linkText: Voir le guide monorepo
  - title: CI/CD
    details: Principes et exemples de pipelines GitHub Actions pour l'intégration et le déploiement continus.
    link: /ci-cd/
    linkText: Voir la CI/CD
---
