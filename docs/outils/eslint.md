# ESLint

## Qu’est-ce que ESLint

ESLint est, comme son nom l’indique, un *linter*, et est aussi par extension un *formateur*, même si ce n’est pas son but premier.

Cf. la partie ESLint des [conventions](/conventions/#conventions-de-lint-et-formattage)

## Installation de ESLint dans un projet

ESLint doit être installé en tant que dépendance de développement du projet, avec les plugins et config additionnels.

Ensuite il doit être configuré dans votre éditeur (comme VS Code) ou IDE (comme JetBrains).

Pour VS Code, il faut installer l’extension [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), et voici la configuration minimale recommandée :

```json
  "editor.codeActionsOnSave": {
    "source.fixAll": true, //
  },
  "eslint.format.enable": true,
  "eslint.validate": [
    "javascript",
    "typescript",
    "vue"
  ],
  "eslint.workingDirectories": [
    {
      "mode": "auto"
    }
  ],
```

Cf. [partie dédiée aux installations](../installations/) pour plus de configurations pour VS Code.

### Dans un projet Vue

Par rapport à la configuration de base de ESLint par `npm create vue`, il convient de modifier le fichier `.eslintrc.cjs` comme suit :

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

::: tip
Cette configration est déjà présente dans un projet créé avec `create-vue-dsfr`.

Pour créer un projet avec `create-vue-dsfr`, lancer une des commandes suivantes :

```shell
npm init vue-dsfr
```

ou

```shell
pnpm create vue-dsfr
```

:::

### Dans un projet back

Dans un projet back, la configuration est plus simple :

```javascript
/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')
module.exports = {
  root: true,
  extends: [
    'eslint-config-typescript/recommended',
    'standard',
  ],
  rules: {
    'jsx-quotes': [2, 'prefer-double'],
    'comma-dangle': [2, 'always-multiline'],
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

### Dans un projet fullstack

::: info
Dans un projet fullstack, si le back est en Python, cela revient à avoir un projet uniquement front pour eslint.
:::

Idéalement, la configuration eslint ne serait faite qu’une seule fois, dans un ***workspace*** dédié à cela, et qui serait utilisé par tous les autres *workspaces*.

Cf. le [gabarit d’exemple de monorepo](https://github.com/laruiss/template-monorepo) sur GitHub.
