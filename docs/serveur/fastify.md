# Construire un projet Fastify

[Fastify](https://www.fastify.io/) est un framework web pour Node.js axé sur la performance et l'expérience développeur. Il offre un système de plugins puissant, une validation des schémas intégrée via JSON Schema, et un support natif de TypeScript.

## Initialisation d'un projet

```shell
mkdir my-app && cd my-app
pnpm init
pnpm add fastify
pnpm add -D typescript @types/node tsx
```

Créer un fichier `tsconfig.json` :

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"]
}
```

## Structure du projet

cf. [Architecture de dossiers](/conventions/architecture-dossiers)

```txt
├── src
│   ├── index.ts              # Point d'entrée
│   ├── app.ts                # Configuration Fastify
│   ├── plugins
│   │   ├── cors.ts           # Plugin CORS
│   │   └── swagger.ts        # Plugin OpenAPI
│   ├── routes
│   │   ├── index.ts          # Enregistrement des routes
│   │   └── cats
│   │       ├── index.ts      # Routes /cats
│   │       ├── cats.schema.ts
│   │       └── cats.service.ts
│   └── utils
│       └── logger.ts
├── test
│   └── routes
│       └── cats.test.ts
├── package.json
└── tsconfig.json
```

## Conventions

### Plugins

Fastify repose sur un système de **plugins** pour structurer l'application. Chaque plugin encapsule un domaine fonctionnel.

```typescript
import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

const myPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('myUtil', () => {
    // ...
  })
}

// fp() permet de rendre le plugin accessible dans tout le scope parent
export default fp(myPlugin, {
  name: 'my-plugin',
})
```

### Validation avec JSON Schema

La validation des entrées est **obligatoire** et se fait via les JSON Schemas intégrés à Fastify. Il est recommandé d'utiliser [`@sinclair/typebox`](https://github.com/sinclairlabs/typebox) pour écrire les schémas avec l'inférence TypeScript :

```typescript
import { Type, Static } from '@sinclair/typebox'

const CatSchema = Type.Object({
  id: Type.Number(),
  name: Type.String({ minLength: 1 }),
  age: Type.Number({ minimum: 0 }),
})

type Cat = Static<typeof CatSchema>

const CatParams = Type.Object({
  id: Type.Number(),
})

export const getCatOpts = {
  schema: {
    params: CatParams,
    response: {
      200: CatSchema,
    },
  },
}
```

### Routes

Les routes utilisent le pattern « autoload » via [`@fastify/autoload`](https://github.com/fastify/fastify-autoload) ou sont enregistrées manuellement en tant que plugins :

```typescript
import { FastifyPluginAsync } from 'fastify'

const catsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async () => {
    return fastify.catsService.findAll()
  })

  fastify.get<{ Params: { id: number } }>('/:id', { schema: getCatOpts.schema }, async (request) => {
    return fastify.catsService.findById(request.params.id)
  })

  fastify.post<{ Body: Cat }>('/', async (request, reply) => {
    const cat = await fastify.catsService.create(request.body)
    return reply.code(201).send(cat)
  })
}

export default catsRoutes
```

## Logging

Fastify intègre [pino](https://getpino.io/) comme logger par défaut. Il suffit de l'activer à l'initialisation :

```typescript
import Fastify from 'fastify'

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL ?? 'info',
    // En développement, utiliser pino-pretty pour un affichage lisible
    ...(process.env.NODE_ENV === 'development' && {
      transport: {
        target: 'pino-pretty',
      },
    }),
  },
})
```

Utiliser le logger dans les routes :

```typescript
fastify.get('/cats', async (request) => {
  request.log.info('Récupération de tous les cats')
  return catsService.findAll()
})
```

## Gestion des erreurs

Définir un gestionnaire d'erreurs global :

```typescript
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'

fastify.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  request.log.error(error)

  const statusCode = error.statusCode ?? 500

  reply.status(statusCode).send({
    statusCode,
    error: error.name,
    message: error.message,
    timestamp: new Date().toISOString(),
  })
})
```

## Documentation OpenAPI

L'API doit fournir une documentation OpenAPI. Utiliser [`@fastify/swagger`](https://github.com/fastify/fastify-swagger) avec [`@fastify/swagger-ui`](https://github.com/fastify/fastify-swagger-ui) :

```shell
pnpm add @fastify/swagger @fastify/swagger-ui
```

```typescript
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'

await fastify.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Mon API',
      version: '1.0.0',
    },
  },
})

await fastify.register(fastifySwaggerUI, {
  routePrefix: '/documentation',
})
```

## Tests

Fastify fournit une méthode `inject()` pour tester les routes sans démarrer le serveur :

```typescript
import { describe, it, expect } from 'vitest'
import { buildApp } from '../src/app'

describe('GET /cats', () => {
  it('should return a list of cats', async () => {
    const app = await buildApp()

    const response = await app.inject({
      method: 'GET',
      url: '/cats',
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toBeInstanceOf(Array)
  })
})
```

::: tip Voir aussi
- [Prisma (ORM)](/stack/prisma) — Intégration de l'ORM recommandé
- [Architecture des dossiers](/conventions/architecture-dossiers) — Structure de référence Fastify
- [Du POC à la production](/conventions/poc-to-prod) — Checklist avant mise en production
:::
