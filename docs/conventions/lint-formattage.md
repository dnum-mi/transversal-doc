# Conventions de lint et formattage

## Editorconfig

Editorconfig est un logiciel soit inclus dans les éditeurs (JetBrains), soit disponible sous forme d’extension (VSCode).

Voici la configuration recommandée (dans le fichier `.editorconfig` à la racine du projet) :

```ini
# EditorConfig is awesome: https://EditorConfig.org

# top-most EditorConfig file
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

```

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
  parser: '@typescript-eslint/parser',
  plugins: [
    'prettier', //
  ],
  extends: [
    'eslint:recommended', //
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript/recommended',
    'standard',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
    'vue/setup-compiler-macros': true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off', //
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'comma-dangle': ['error', 'always-multiline'],
  },
  overrides: [
    {
      files: ['cypress/support/*.{js,ts,jsx,tsx}', 'cypress/integration/*.{spec,e2e}.{js,ts,jsx,tsx}', 'src/**/*.ct.{js,ts,jsx,tsx}'],
      extends: ['plugin:cypress/recommended'],
    },
    {
      files: ['src/**/*.{spec,test}.{js,ts,jsx,tsx}'],
      env: {
        jest: true,
      },
    },
  ],
}
```

## Optionnellement [Prettier](https://prettier.io/)

Si prettier (>3.0.0) est utilisé en plus d’ESLint, il doit l’être avec la version ces options :

```json
{
  "singleQuote": true,
  "semi": false,
  "singleAttributePerLine": true
}
```

et ESLint doit être utilisé avec [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier),
et il faut ajouter cette ligne à la configuration eslint :

```diff
   extends: [
     'eslint:recommended', //
     'plugin:vue/vue3-recommended',
     '@vue/eslint-config-typescript/recommended',
     'standard',
+    'plugin:prettier/recommended',
   ],
```

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
