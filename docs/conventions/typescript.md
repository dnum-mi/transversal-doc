# Conventions TypeScript

TypeScript (TS) est **très fortement** recommandé, et avec la version stricte : TS ne doit pas émettre de fichier JavaScript si le compilateur sort en erreur.
::: tip Voir aussi
- [Lint et formattage](/conventions/lint-formattage) — Configuration ESLint et Prettier pour TypeScript
- [Nommage](/conventions/nommage) — Conventions de nommage des variables et fichiers
:::
`any` doit être évité au maximum et devrait être très rare.

`object` doit être proscrit, même `Record<string | symbol, any>` est préférable.

`enum` est proscrit, de même que `namespace`. Ces deux fonctionnalités ne respectent pas l’esprit de TS, qui doit être uniquement du typage :

Avec les `enum`, le compilateur rajoute du code JS qui n’existe pas dans le code TS initial. La philosophie de TS est que si on enlève simplement le typage, le code doit être du JavaScript valide. Ce n’est pas le cas avec les `enum`. Or on peut obtenir la même chose avec les unions.

Ex. :

```typescript
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
```

au lieu de

```typescript
enum HttpMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Patch = 'PATCH',
}
```

Au lieu d’utiliser les namespaces, il faut utiliser les modules. Cf. cette réponse sur [StackOverflow](https://stackoverflow.com/questions/56059351/tslint-namespace-and-module-are-disallowed#56061134), par exemple.
## `interface` vs `type`

Les deux sont valables. Cependant, voici quelques recommandations :

- Utiliser `interface` pour décrire la forme d'un objet (contrats d'API, props de composants, entités).
- Utiliser `type` pour les unions, intersections, types utilitaires et types mappés.

```typescript
// ✅ interface pour un objet / contrat
interface User {
  id: number
  name: string
  email: string
}

// ✅ type pour une union
type Status = 'active' | 'inactive' | 'pending'

// ✅ type pour un type utilitaire
type PartialUser = Partial<User>
type UserWithoutId = Omit<User, 'id'>
```

## `as const`

Utiliser `as const` pour créer des constantes immuables avec des types littéraux inférés :

```typescript
// ✅ Bien
const ROLES = ['admin', 'editor', 'viewer'] as const
type Role = typeof ROLES[number] // 'admin' | 'editor' | 'viewer'

const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL: 500,
} as const
```

## Unions discriminées

Les unions discriminées (ou *tagged unions*) sont un pattern puissant pour modéliser des états mutuellement exclusifs :

```typescript
type ApiResponse<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

function handleResponse(response: ApiResponse<User>) {
  if (response.status === 'success') {
    // TypeScript sait que response.data existe ici
    console.log(response.data.name)
  } else {
    // TypeScript sait que response.error existe ici
    console.error(response.error)
  }
}
```

## Validation runtime avec Zod

TypeScript ne valide les types qu'à la compilation. Pour valider les données à l'exécution (entrées utilisateur, réponses d'API, variables d'environnement), utiliser [Zod](https://zod.dev/) :

```typescript
import { z } from 'zod'

const UserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().int().positive(),
})

// Inférer le type TypeScript depuis le schéma Zod
type User = z.infer<typeof UserSchema>

// Validation à l'exécution
const result = UserSchema.safeParse(data)
if (result.success) {
  // result.data est typé comme User
  console.log(result.data.name)
} else {
  console.error(result.error.issues)
}
```

## Types utilitaires

TypeScript propose des types utilitaires (*utility types*) à utiliser plutôt que de redéfinir manuellement les types :

```typescript
// Partial<T> : toutes les propriétés deviennent optionnelles
type UpdateUser = Partial<User>

// Required<T> : toutes les propriétés deviennent obligatoires
type CompleteUser = Required<User>

// Pick<T, K> : sélectionner certaines propriétés
type UserPreview = Pick<User, 'id' | 'name'>

// Omit<T, K> : exclure certaines propriétés
type CreateUser = Omit<User, 'id' | 'createdAt'>

// Record<K, V> : créer un type d'objet avec clés/valeurs typées
type RolePermissions = Record<Role, string[]>

// ReturnType<T> : extraire le type de retour d'une fonction
type ServiceResult = ReturnType<typeof myService.getData>
```
