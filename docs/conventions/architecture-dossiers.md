# Conventions d’architecture de dossier

::: tip Points clés
- Chaque type de projet a une arborescence de référence : NestJS (page dédiée), Fastify, Vue.js, FastAPI.
- Fastify : `src/` avec `index.ts` (démarrage), `app.ts` (instance), `plugins/`, `routes/<ressource>/` (routes, schémas, service) et `utils/` ; tests dans `test/`.
- Vue.js : `src/` avec `components/` (réutilisables), `stores/`, `views/` (une page par dossier, ses composants dans `components/`), `utils/` ; `public/` pour les fichiers copiés tels quels.
- Vue.js : tests (`.cy.ts`, `.spec.ts`) à côté du composant qu’ils testent.
- FastAPI : `app/` avec `main.py`, `config.py`, `models/`, `schemas/`, `routers/`, `services/`, `utils/` ; tests dans `tests/`, `pyproject.toml`, `uv.lock` et `Dockerfile` à la racine.
:::

## NestJS

Cf. [page dédiée](/serveur/nestjs)

## Fastify

```txt
├── src
│   ├── index.ts              # Point d'entrée (démarrage du serveur)
│   ├── app.ts                # Configuration et instanciation de Fastify
│   ├── plugins
│   │   ├── cors.ts           # Plugin CORS
│   │   ├── swagger.ts        # Plugin OpenAPI / Swagger
│   │   └── auth.ts           # Plugin d'authentification
│   ├── routes
│   │   ├── index.ts          # Enregistrement des routes
│   │   └── cats
│   │       ├── index.ts      # Définition des routes /cats
│   │       ├── cats.schema.ts  # Schémas de validation (JSON Schema / Typebox)
│   │       └── cats.service.ts # Logique métier
│   └── utils
│       └── Ici les fonctions utilitaires
├── test
│   └── routes
│       └── cats.test.ts
├── package.json
└── tsconfig.json
```

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

## FastAPI

```txt
├── app
│   ├── __init__.py
│   ├── main.py                # Point d'entrée FastAPI
│   ├── config.py              # Configuration (variables d'environnement)
│   ├── models
│   │   ├── __init__.py
│   │   └── cat.py             # Modèles ORM (SQLAlchemy / Tortoise)
│   ├── schemas
│   │   ├── __init__.py
│   │   └── cat.py             # Schémas Pydantic (validation entrées/sorties)
│   ├── routers
│   │   ├── __init__.py
│   │   └── cats.py            # Routes /cats (APIRouter)
│   ├── services
│   │   ├── __init__.py
│   │   └── cats.py            # Logique métier
│   └── utils
│       ├── __init__.py
│       └── Ici les fonctions utilitaires
├── tests
│   ├── __init__.py
│   └── test_cats.py
├── pyproject.toml
├── uv.lock
└── Dockerfile
```

::: tip Voir aussi
- [Monorepo](/monorepo/) — Architecture et configuration pour les projets multi-packages
- [NestJS](/serveur/nestjs) — Structure détaillée d'un projet NestJS
- [FastAPI](/serveur/fastapi) — Structure détaillée d'un projet FastAPI
:::
