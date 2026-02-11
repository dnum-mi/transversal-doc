# Bonnes pratiques de code

## Taille des lignes

Les lignes sont par défaut de 80 colonnes si Prettier est utilisé. C’est un héritage des consoles qui ne pouvaient afficher que 80 colonnes. Cela fait un peu court avec les écrans dont nous disposons aujourd’hui.

Les lignes de plus de 120 colonnes doivent être évitées, et les lignes de plus de 140 colonnes **proscrites**.

Pour VS Code, le paramètre suivant permet de montrer ces deux limites dans la vue éditeur :

```json
  "editor.rulers": [120, 140],
```

## Taille des fonctions/méthodes

Une fonction (ou méthode) ne devrait pas faire plus de 20 lignes.

## Une fonction - un but

Une fonction ne doit faire qu’une chose, et le faire bien, et idéalement être testée.

Le nom de la fonction doit être explicite quant à sa raison d'être.

## Gestion des erreurs

### Ne jamais ignorer silencieusement les erreurs

```typescript
// ❌ Mal
try {
  await fetchData()
} catch {
  // silencieux
}

// ✅ Bien
try {
  await fetchData()
} catch (error) {
  logger.error(error, 'Erreur lors de la récupération des données')
  throw error
}
```

### Utiliser des erreurs typées

Créer des classes d'erreurs spécifiques plutôt que d'utiliser des `Error` génériques :

```typescript
class NotFoundError extends Error {
  constructor(resource: string, id: string | number) {
    super(`${resource} avec l'id ${id} non trouvé`)
    this.name = 'NotFoundError'
  }
}
```

## Async/await

### Toujours utiliser `async`/`await` plutôt que `.then()`/`.catch()`

```typescript
// ❌ Mal
function getUser(id: number) {
  return fetch(`/users/${id}`)
    .then(res => res.json())
    .then(data => data)
    .catch(err => console.error(err))
}

// ✅ Bien
async function getUser(id: number) {
  const response = await fetch(`/users/${id}`)
  return response.json()
}
```

### Paralléliser les opérations indépendantes

```typescript
// ❌ Mal : séquentiel inutilement
const users = await getUsers()
const posts = await getPosts()

// ✅ Bien : parallèle
const [users, posts] = await Promise.all([
  getUsers(),
  getPosts(),
])
```

## Ordre des imports

Les imports doivent être ordonnés de manière cohérente. La configuration ESLint recommandée (cf. [ESLint](/stack/eslint)) gère cela automatiquement. L'ordre recommandé est :

1. Modules Node.js natifs (`node:fs`, `node:path`)
2. Packages externes (`fastify`, `vue`)
3. Modules internes (alias `@/`, `~/`)
4. Modules relatifs (`./`, `../`)

Chaque groupe doit être séparé par une ligne vide.

## Constantes magiques

Les valeurs « magiques » (nombres ou chaînes sans contexte) doivent être extraites dans des constantes nommées :

```typescript
// ❌ Mal
if (password.length < 8) { ... }
setTimeout(fn, 86400000)

// ✅ Bien
const MIN_PASSWORD_LENGTH = 8
const ONE_DAY_MS = 24 * 60 * 60 * 1000

if (password.length < MIN_PASSWORD_LENGTH) { ... }
setTimeout(fn, ONE_DAY_MS)
```

## Choix et veille des dépendances

Avant d'ajouter une dépendance (bibliothèque, framework, action GitHub, image Docker…), il faut systématiquement évaluer :

1. **La version courante** — toujours utiliser la dernière version stable majeure, jamais `@latest` ou `@master` en production.
2. **La popularité** — nombre de téléchargements hebdomadaires, nombre de stars GitHub.
3. **La fréquence de mise à jour** — un projet sans commit depuis 12 mois est un signal d'alerte.
4. **La maintenance** — nombre et ancienneté des issues ouvertes, réactivité des mainteneurs, présence d'un `SECURITY.md`.
5. **La taille** — impact sur le bundle final ([bundlephobia.com](https://bundlephobia.com) pour les packages npm).

Outils utiles :

| Outil                                                                    | Usage                                                     |
| ------------------------------------------------------------------------ | --------------------------------------------------------- |
| [npm trends](https://npmtrends.com/)                                     | Comparer la popularité et l'activité de packages npm      |
| [Bundlephobia](https://bundlephobia.com/)                                | Vérifier la taille d'un package avant de l'installer      |
| [Snyk Advisor](https://snyk.io/advisor/)                                 | Score de santé global (maintenance, sécurité, communauté) |
| [Socket.dev](https://socket.dev/)                                        | Détection de risques dans la chaîne d'approvisionnement   |
| [GitHub Dependabot](https://docs.github.com/en/code-security/dependabot) | Alertes automatiques de mises à jour et de vulnérabilités |

::: warning Référencer `@master` ou `@main` dans une GitHub Action est un risque de sécurité.
Toujours épingler les actions sur un tag de version (ex. `actions/checkout@v6`).
:::

## Retours anticipés (early return)

Privilégier les retours anticipés pour éviter l'imbrication excessive :

```typescript
// ❌ Mal
function processUser(user: User | null) {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission) {
        // traitement...
      }
    }
  }
}

// ✅ Bien
function processUser(user: User | null) {
  if (!user) return
  if (!user.isActive) return
  if (!user.hasPermission) return

  // traitement...
}
```
