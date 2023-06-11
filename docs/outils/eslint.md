# ESLint

## Qu’est-ce que ESLint

ESLint est, comme son nom l’indique un linter, et est aussi par extension un formateur, même si ce n’est pas son but premier.

Cf. la partie ESLint des [conventions](/conventions/#conventions-de-lint-et-formattage)

## Installation de ESLint dans un projet

TODO: write

### Dans un projet Vue

Par rapport à la configuration de base de ESLint par `npm create vue`, il faut modifier comme suit :

```diff
 /* eslint-env node */
 require('@rushstack/eslint-patch/modern-module-resolution')

 module.exports = {
   root: true,
   extends: [
-    'plugin:vue/vue3-essential',
+    'plugin:vue/vue3-recommended',
     '@vue/eslint-config-typescript/recommended',
+    'standard',
   ],
   env: {
     'vue/setup-compiler-macros': true,
   },

   rules: {
     'jsx-quotes': [2, 'prefer-double'],
+    'comma-dangle': [2, 'always-multiline'],
   },
   overrides: [
     {
       files: [
         'cypress/support/*.{js,ts,jsx,tsx}',
         'cypress/integration/*.{spec,e2e}.{js,ts,jsx,tsx}',
         'src/**/*.ct.{js,ts,jsx,tsx}',
       ],
       extends: [
         'plugin:cypress/recommended',
       ],
     },
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

Et ajouter les packages suivants :

  -`eslint-config-standard`
  -`eslint-plugin-import`
  -`eslint-plugin-n`
  -`eslint-plugin-promise`

Vous pouvez le faire avec la commande suivante :

```console
pnpm install -D eslint-config-standard eslint-plugin-promise eslint-plugin-import eslint-plugin-n
```

Ou, si vous avez installé `@antfu/ni` (recommandé) :

```console
ni -D eslint-config-standard eslint-plugin-promise eslint-plugin-import eslint-plugin-n
```

### Dans un projet back

TODO: write

### Dans un projet fullstack

TODO: write

## ESLint dans VS Code

Il faut installer l’[extension ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), et ajouter dans les paramètres :

```json
"editor.codeActionsOnSave": {
  "source.fixAll": true,
},
```
