# [Prisma](https://www.prisma.io/)

[Prisma](https://www.prisma.io/) est l'ORM recommandé pour les projets Node.js/TypeScript de la Fabrique Numérique. Il offre un client type-safe auto-généré, un système de migrations, et un studio de visualisation de données.

## VS Code

Installer l'[extension VS Code](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)

## Installation

```shell
pnpm add prisma -D
pnpm add @prisma/client
npx prisma init
```

Cette commande crée :

- un dossier `prisma/` avec un fichier `schema.prisma`
- un fichier `.env` avec la variable `DATABASE_URL`

::: tip Prisma 7+
Depuis Prisma 7, le générateur par défaut est `prisma-client` (au lieu de `prisma-client-js` qui est déprécié). Ce nouveau générateur nécessite un chemin `output` explicite et génère du TypeScript directement dans votre projet au lieu de `node_modules`.
:::

## Schema Prisma

Le fichier `prisma/schema.prisma` définit les modèles et les relations :

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Cat {
  id        Int      @id @default(autoincrement())
  name      String
  age       Int
  breed     String?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  owner     User?    @relation(fields: [ownerId], references: [id])
  ownerId   Int?     @map("owner_id")

  @@map("cats")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  cats      Cat[]
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("users")
}
```

### Conventions de nommage du schema

- **Modèles** : `PascalCase` au singulier (`Cat`, `User`)
- **Champs** : `camelCase` dans le code (`createdAt`), avec `@map("snake_case")` pour la base de données
- **Tables** : `snake_case` au pluriel via `@@map("cats")`
- **Relations** : nommer explicitement les clés étrangères avec `@map`

## Migrations

```shell
# Créer une migration à partir des changements du schema
npx prisma migrate dev --name init

# Appliquer les migrations en production
npx prisma migrate deploy

# Réinitialiser la base (attention : supprime les données)
npx prisma migrate reset
```

::: warning
Ne jamais modifier les fichiers de migration manuellement. Toujours passer par `prisma migrate dev` pour générer les migrations.
:::

## Utilisation du client

```typescript
import { PrismaClient } from './generated/prisma/client'

const prisma = new PrismaClient()

// Créer
const cat = await prisma.cat.create({
  data: {
    name: 'Minou',
    age: 3,
  },
})

// Lire
const cats = await prisma.cat.findMany({
  where: { age: { gte: 2 } },
  include: { owner: true },
  orderBy: { name: 'asc' },
})

// Mettre à jour
const updated = await prisma.cat.update({
  where: { id: 1 },
  data: { age: 4 },
})

// Supprimer
await prisma.cat.delete({
  where: { id: 1 },
})
```

## Bonnes pratiques

### Singleton du client

Ne créer qu'**une seule instance** de `PrismaClient` par application :

```typescript
// src/utils/prisma.ts
import { PrismaClient } from '../generated/prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

### Seeding

Créer un fichier `prisma/seed.ts` pour peupler la base avec des données initiales :

```typescript
import { PrismaClient } from '../src/generated/prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.cat.createMany({
    data: [
      { name: 'Minou', age: 3 },
      { name: 'Felix', age: 5 },
      { name: 'Garfield', age: 7 },
    ],
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Ajouter dans `package.json` :

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

Puis lancer : `npx prisma db seed`

### Prisma Studio

Pour visualiser et éditer les données en local :

```shell
npx prisma studio
```
