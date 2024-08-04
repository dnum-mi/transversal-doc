# ESLint

## Qu’est-ce que ESLint

ESLint est, comme son nom l’indique, un *linter*, et est aussi par extension un *formateur*, même si ce n’est pas son but premier.

Cf. la partie ESLint des [conventions](/conventions/#conventions-de-lint-et-formattage)

## Installation de ESLint dans un projet

ESLint doit être installé en tant que dépendance de développement du projet, avec les plugins et configs additionnels.

Ensuite il doit être configuré dans votre éditeur (comme VS Code) ou IDE (comme JetBrains).

Pour VS Code, il faut installer l’extension [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), et voici la configuration minimale recommandée :

```json
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit",
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
  "eslint.useFlatConfig": true, // Attention, à ne pas utiliser si vous utilisez encore l’ancien système de config
```

Cf. [partie dédiée aux installations](../installations/) pour plus de configurations pour VS Code.

### Dans un projet Vue

Il est fortement conseillé de travailler à partir de la [configuration de Anthony Fu](https://eslint-config.antfu.me/), et de la modifier en surchargeant quelques règles comme suit :

```js
import antfu from '@antfu/eslint-config'

export default antfu({
}, [
  {
    rules: {
      'style/operator-linebreak': ['error', 'after', { overrides: { '?': 'before', ':': 'before' } }],
      'style/space-before-function-paren': ['error', 'always'],
      'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'curly': ['error', 'all'],
      'ts/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
      'import/order': [
        1,
        {
          'newlines-between': 'always',
        },
      ],
      'comma-dangle': [
        'error',
        'always-multiline',
      ],
    },
  },
])
```

::: tip Astuce

Pour une compatibilité des [régions](https://dev.to/hurricaneinteractive/vs-code-define-a-region-1cd1) entre VSCode et JetBrains, on peut surcharger la règle `style/spaced-comment` comme suit :

```js
// (...)
    'style/spaced-comment': [
      'error',
      'always',
      {
        markers: [
          '#region',
          '#endregion',
          '/',
        ],
      },
    ],
// (...)
```

:::

::: tip Astuce

Pour pouvoir utiliser des [espaces insécables et des espaces fines insécables](https://www.lalanguefrancaise.com/articles/espace-insecable), il faut ajouter ces deux surcharges :

```js
// (...)
    'no-irregular-whitespace': 'off',
    'vue/no-irregular-whitespace': 'off',
// (...)
```

:::

Et ajouter les packages suivants :

-`@antfu/eslint-config`

Vous pouvez le faire avec la commande suivante :

```console
pnpm install -D eslint @antfu/eslint-config
```

Ou, si vous avez installé `@antfu/ni` (recommandé) :

```console
ni -D eslint @antfu/eslint-config
```

### Dans un projet back

Dans un projet back, la configuration est la même, avec ces deux surcharges en plus :

```ts
// (...)
  'no-unused-vars': 'off',
  'ts/no-unused-vars': 'off',
// (...)
```

### Dans un projet fullstack

::: info
Dans un projet fullstack, si le back est en Python, cela revient à avoir un projet uniquement front pour eslint.
:::

Idéalement, la configuration eslint ne serait faite qu’une seule fois, dans un ***workspace*** dédié à cela, et qui serait utilisé par tous les autres *workspaces*.

Cf. le [gabarit d’exemple de monorepo](https://github.com/laruiss/template-monorepo) sur GitHub.

### Les scripts de lint et de formattage

Les scripts de formattage et de fix doivent être séparés :

```json
"lint": "eslint .",
"format": "eslint . --fix",
```
