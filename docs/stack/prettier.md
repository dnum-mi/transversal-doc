# Prettier

## Qu'est-ce que Prettier

[Prettier](https://prettier.io/) est un formateur de code opinionated. Il reformate automatiquement le code pour garantir un style cohérent dans tout le projet.

## Prettier et ESLint

Historiquement, Prettier était utilisé conjointement avec ESLint : ESLint pour le linting et Prettier pour le formattage. Cela nécessitait des plugins de compatibilité (`eslint-config-prettier`, `eslint-plugin-prettier`) et créait parfois des conflits.

Avec la [configuration ESLint d'Anthony Fu](https://eslint-config.antfu.me/) recommandée par la Fabrique Numérique (cf. [page dédiée à ESLint](/stack/eslint)), **le formattage est directement géré par ESLint**. Dans ce cas, Prettier n'est **pas nécessaire** et ne devrait **pas** être ajouté au projet pour éviter les conflits.

::: tip Recommandation
Si vous utilisez `@antfu/eslint-config` (ce qui est recommandé), **n'installez pas Prettier**. ESLint gère à la fois le linting et le formattage.
:::

## Quand utiliser Prettier

Prettier reste utile dans les cas suivants :

- **Projets legacy** qui n'utilisent pas encore la configuration ESLint recommandée
- **Formattage de fichiers non-JS/TS** : Prettier supporte le formattage de fichiers Markdown, JSON, YAML, CSS, HTML, etc., que ESLint ne couvre pas nativement

## Configuration minimale

Si Prettier est utilisé dans un projet, voici la configuration recommandée (fichier `.prettierrc`) :

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 120,
  "tabWidth": 2,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

Et le fichier `.prettierignore` :

```txt
dist
node_modules
pnpm-lock.yaml
```
