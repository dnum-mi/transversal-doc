# Conventions

Ce document rassemble toutes les conventions qu’un projet JavaScript/TypeScript de la Fabrique Numérique doit suivre.

Ces conventions concernent la documentation, le nommage, l’architecture, la gestion de la journalisation et des erreurs, ainsi que certaines bonnes pratiques concernant l’accessibilité et l’expérience utilisateur.

## Documentation

Chaque projet doit avoir 2 documentations, distinctes et mises à jour régulièrement :

- une pour les utilisateurs
- une pour les développeurs

Éventuellement une troisième pour ceux qui seront en charge du déploiement.

La documentation pour les développeurs doit contenir :

- une liste des prérequis (OS et leurs versions, logiciels et leurs versions à avoir pour travailler sur le projet)
- la stack détaillée du projet
- un TL;DR avec comment lancer les tests, comment démarrer l’application
- une partie pour les nouveaux arrivants sur le projet (très important)
- les conventions à suivre pour ce projet

## Conventions de nommage

### Noms de branche git

Le nom de branche doit être formé de la façon suivante :

`<feat|fix|hotfix|tech|docs|refacto>/<description-en-kebab-case>#<ticket_github>`

- `feat` pour une nouvelle fonctionnalité
- `fix` pour une correction d’anomalie ou correction de graphie
- `hotfix` pour une correction d’anomalie qui est déjà en prod
- `tech` pour une amélioration technique (réduction de dette technique, changement de nom de table ou champ, amélioration de script de build ou de  déploiement...)
- `docs` pour une modification de la documentation
- `refacto` pour un remaniement du code (qui n’ajoute pas de fonctionnalité pour l’utilisateur)

Exemples :

- `feat/worker-logs#353`
- `refacto/reorganize-backend#360`

### Message de validation (*commit*)

Les messages de validation *git* doivent respecter les conventions de [Commits Conventionnels](https://www.conventionalcommits.org/fr/v1.0.0/).

le projet étant franco-français d’une part, et l’anglais n’étant que rarement maîtrisé d’autre part, les messages de commit devraient être au maximum en français.

### Noms de dossiers et fichiers

Les **noms des dossiers et des fichiers** doivent impérativement être écrits en [**kebab-case**](https://www.freecodecamp.org/news/snake-case-vs-camel-case-vs-pascal-case-vs-kebab-case-whats-the-difference/) avec une seule exception : les noms de dossiers et de fichiers de composants Vue et des fichiers s’y afférents (fichiers de tests unitaires et de tests end-to-end, par exemple).

Les noms de **composants Vue** doivent impérativement être formés d’**au moins 2 mots**, avec une seule exception : le composant `App.vue`

Exemple d’une application Vue :

```console
.
├── README.md
├── env.d.ts
├── index.html
├── package.json
├── public
│   ├── browserconfig.xml
│   ├── favicon.ico
│   ├── icons
│   │   ├── android-icon-144x144.png
│   │   ├── ...
│   │   └── ms-icon-70x70.png
│   ├── manifest.json
│   └── marianne-icon.png
├── src
│   ├── App.vue
│   ├── components
│   │   ├── BadgeTypeOrganisme.vue
│   │   ├── BiblioNumDataTable.cy.ts
│   │   ├── BiblioNumDataTable.vue
│   ├── stores
│   │   ├── index.ts
│   │   ├── role.ts
│   │   └── user.ts
│   └── utils
│       ├── __tests__
│       │   └── fake-data.ts
│       ├── api-client.ts
│       └── demarche-mapping.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.vite-config.json
├── tsconfig.vitest.json
├── vite.config.ts
└── vitest-setup.ts
```

### Noms de variables

- variable contenant une valeur booléenne : doit commencer par `is` (rarement `has`, `should` ou `can`) et être en `camelCase`  (comme `isReallyTrue`)
- variable contenant une date : doit être préfixée par `Date` ou `At` et être en `camelCase`  comme `startDate` ou `lastModifiedAt`
- fonction constructeur et classe : `PascalCase`
- autre variable ou fonction : `camelCase`
- constante : `SCREAMING_SNAKE_CASE`

Les noms de variables et de fonctions (méthodes aussi) doivent être explicite, et donc potentiellement très long... Jusqu’à une certaine limite.

Les noms de variable d’un seul caractères doivent être proscrit, sauf dans de (très très) rares cas, comme la fonction d’identité (`x => x`) ou des fonctions fléchées extrêmement simples.

Les **noms de variable doivent être au maximum en anglais**, et **peuvent être en français dans certains cas** si la traduction prête à confusion ou trop difficile (`demarche` ou `dossier`) ou si c’est un mot réservé (`affaire` peut rester `affaire` pour ne pas utiliser `case`).

## Conventions d’architecture de dossier

### NestJS

Cf. [page dédiée](/serveur/nestjs.md)

### Fastify

### Vue.js

```
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

## Conventions TypeScript

TypeScript (TS) est **très fortement** recommandé, et avec la version stricte : TS ne doit pas émettre de fichier JavaScript si le compilateur sort en erreur.

`any` doit être évité au maximum et devrait être très rare.

`object` doit être proscrit, même `Record<string | symbol, any>` est préférable.

`enum` est proscrit, de même que `namespace`. Ces deux fonctionnalités ne respectent pas l’esprit de TS, qui doit être uniquement du typage :

Avec les `enum`, le compilateur rajoute du code JS qui n’existe pas dans le code TS initial. La philosophie de TS est que si on enlève simplement le typage, le code doit être du JavaScript valide. Ce n’est pas le cas avec les `enum`. Or on peut obtenir la même chose avec les unions.

Ex. :

```
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
```

au lieu de

```
enum HttpMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Patch = 'PATCH',
}
```

Au lieu d’utilser les namespaces, il faut utiliser les modules. Cf. Cette réponse sur [SO](https://stackoverflow.com/questions/56059351/tslint-namespace-and-module-are-disallowed#56061134), par exemple.

## Conventions pour les API

### Nommage des routes

Les noms de routes d’API doivent **comporter uniquement des noms, jamais de verbes** et toujours au pluriel. C’est la méthode HTTP utilisée (d’ailleurs aussi appelée « verbe ») qui fait office de verbe.

Bien :

```
/auth/token
/users/1
```

Mal :

```
/session/create
/users/get/1
/user/1
```

Exemples :

- POST /cats (pour créer un cat)
- GET /cats (pour récupérer un tableaux de cats)
- GET /cats/:id (pour récupérer un cat)
- PUT /cats/:id (pour modifier toutes les propriétés d’un cat)
- PATCH /cats/:id (pour modifier une partie des propriétés d’un cat)
- DELETE /cats/:id (pour effacer un cat)

### Gestion de la journalisation

Les logs doivent sortir dans la sortie standard pour pouvoir être récupérés via les logs des conteneurs et être éventuellement redistribués à des [ELK](https://www.elastic.co/fr/elastic-stack/).

Chaque requête doit être loggée avec le temps de réponse.

Chaque action importante sur le serveur doit être journalisé (tentative de connexion, création d’un enregistrement/document...).

Les erreurs doivent être récupérées intelligemment et gérées à un seul endroit.

- `verbose` : Utilisé seulement dans un mode dev, pour retracer ce qu'il se passe (Exemple: Je viens de rentrer dans cette fonction)
- `debug` : Utilisé seulement dans un mode dev, dans des cas précis pour aider au debug
- `log` : Une information journalisée tout le temps, comme "serveur online"
- `warn` : Quelque chose qui est prévu mais non normal est arrivé
- `error` : Quelque chose de non prévu et anormal est arrivé. Quelque chose qui est grave et requiert l'attention d'un développeur

Les codes de retours HTTP doivent être cohérents avec ces erreurs.

Les retours d’erreur de l’API RESTful doivent être soit en français et compréhensible par l’utilisateur final, soit en clés qui correspondent à des clés d’un dictionnaire connu côté client.

### Les codes HTTP de retour

- `400` : je ne comprends pas ce que tu dis, qui que tu sois (qui que tu sois mais identifié)
- `401` : je ne sais pas qui tu es, ou bien je ne pense pas que tu sois la personne que tu prétends être, donc je ne te laisse pas rentrer (et mettre le header `WWW-Authenticate: Bearer` dans la réponse)
- `403` : je sais très bien qui tu es, et tel que je te connais, tu vas faire des dégâts, donc je ne te laisse pas rentrer
- `404` : J’ai tout compris, je sais qui tu es (ou je m’en moque) mais je n’ai pas ce que tu veux
- `409` : Conflit. J'ai bien compris ce que tu voulais créer mais cette ressource existe déjà, je ne peux pas l'écraser. (exemple: création d'une démarche avec un id de référence existante)
- `500` : j’ai compris ta requête, mais j’ai un gros problème pour y répondre : je ne sais pas faire

## Conventions de lint et formattage

### Lint avec ESLint

Le code doit être *lint*é et formaté. Le minimum est ESLint avec [standard](https://standardjs.com/) et les seules règles à modifier par rapport à standard sont les suivantes :

- [comma-dangle](https://eslint.org/docs/latest/rules/comma-dangle)
- [no-irregular-whitespace](https://eslint.org/docs/latest/rules/no-irregular-whitespace)

```javascript
  rules: {
    'comma-dangle': ['error', 'always-multiline'], // Pour avoir une virgule au dernier élément des listes si elleso
                                                   // s’il y a un élément par ligne
    'no-irregular-whitespace': 'warning', // Pour pouvoir utiliser l’espace fine insécable devant les signes : ; ? et !
  }
```

Pour NestJS, il faut aussi rajouter ces règles pour les injections de dépendances :

```javascript
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
  }
```

Un fichier de configuratoin ESLint pour NestJS :

```javascript
/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: ['tsconfig.eslint.json', 'tsconfig.json'],
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'standard',
  ],
  rules: {
    'comma-dangle': [2, 'always-multiline'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
  },
  overrides: [
    {
      files: [
        'src/**/*.{spec,test}.{js,ts,jsx,tsx}',
      ],
      env: {
        jest: true,
      },
    },
  ],
}
```

### Optionnellement [Prettier](https://prettier.io/)

Si prettier est utilisé en plus d’ESLint, il doit l’être avec ces options :

```json
{
  "bracketSpacing": true,
  "printWidth": 120,
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "useTabs": false
}
```

### Les scripts de lint et de formattage

Les script de formattage et de fix doivent être séparés :

```json
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\"",
    "format": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
```

Si prettier est utilisé :

```json
    "format": "run-s prettify lint:fix",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\"",
    "lint:fix": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "prettify": "prettier --write \"{src,apps,libs,test}/**/*.ts\"",
```

`run-s` est issu du package npm [`npm-run-all`](https://github.com/mysticatea/npm-run-all) et signifie « exécution en série », `npm-run-all` a aussi `run-p` qui permet d’exécuter des scripts en parallèle.

## Autres conventions pour le code

### Taille des lignes

Les lignes sont par défaut de 80 colonnes si Prettier est utilisé. C’est un héritage des consoles qui ne pouvaient afficher que 80 colonnes. Cela fait un peu court avec les écrans dont nous disposons aujourd’hui.

Les lignes de plus de 120 colonnes doivent être évitées, et les lignes de plus de 140 colonnes **proscrites**.

Pour VS Code, le paramètre suivant permet de montrer ces deux limites dans la vue éditeur :

```json
  "editor.rulers": [120, 140],
```

### Taille des fonctions/méthodes

Une fonction (ou méthode) ne devrait pas faire plus de 20 lignes.

### Une fonction - un but

Une fonction ne doit faire qu’une chose, et le faire bien, et idéalement être testée.

Le nom de la fonction doit être explicite quant à son raison d’être.
