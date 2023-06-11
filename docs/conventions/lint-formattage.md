# Conventions de lint et formattage

## Lint avec ESLint

Le code doit être *lint*é et formaté. Le minimum est ESLint avec [standard](https://standardjs.com/) et les seules règles à modifier par rapport à standard sont les suivantes :

- [comma-dangle](https://eslint.org/docs/latest/rules/comma-dangle)
- [no-irregular-whitespace](https://eslint.org/docs/latest/rules/no-irregular-whitespace)

```javascript
rules: {
  'comma-dangle': ['error', 'always-multiline'], // Pour avoir une virgule au dernier élément des listes
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

Un fichier de configuration ESLint pour NestJS :

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

## Optionnellement [Prettier](https://prettier.io/)

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

et ESLint doit être utilisé avec [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)

### Les scripts de lint et de formattage

Les scripts de formattage et de fix doivent être séparés :

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
