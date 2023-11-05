# Conventions d’architecture de dossier

## NestJS

Cf. [page dédiée](/serveur/nestjs.md)

## Fastify

## Vue.js

```txt
├── README.md
├── env.d.ts
├── index.html
├── package.json
├── public
│   └── Ici ce qui doit être copié tel que dans le dossier de build (favicon, manifest...)
├── src
│   ├── App.vue
│   ├── components
│   │   └── Ici les composants réutilisables dans plusieurs Views
│   ├── stores
│   │   ├── index.ts
│   │   └── Ici les stores (éventuellement dans des sous-dossiers s’il y en a beaucoup)
│   ├── views
│   │   ├── Ici les composants correspondants à des pages, comme AppHome
│   │   ├── AppHome
│   │   │   ├── AppHome.vue
│   │   │   ├── AppHome.cy.ts
│   │   │   ├── AppHome.spec.ts
│   │   │   └── components
│   │   │       └── Ici les composants propres à la view AppHome
│   │   └── SignIn
│   │       ├── SignIn.vue
│   │       ├── SignIn.cy.ts
│   │       ├── SignIn.spec.ts
│   │       └── components
│   │           ├── Ici les composants propres à la view SignIn
│   │           └── LoginForm
│   │               ├── LoginForm.vue
│   │               ├── LoginForm.cy.ts
│   │               └── LoginForm.spec.ts
│   └── utils
│       └── Ici les fonctions utilitaires (traitement de dates, de chaînes...)
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.vite-config.json
├── tsconfig.vitest.json
├── vite.config.ts
└── vitest-setup.ts
```
