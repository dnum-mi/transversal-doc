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

- [comma-dangle](https://eslint.org/docs/latest/rules/comma-dangle) : `['error', 'always-multiline']`
- [no-irregular-whitespace](https://eslint.org/docs/latest/rules/no-irregular-whitespace) : `'warning'`

```javascript
rules: {
  'comma-dangle': ['error', 'always-multiline'], // Pour avoir une virgule au dernier élément des listes
                                                 // s’il y a un élément par ligne
  'no-irregular-whitespace': 'warning', // Pour pouvoir utiliser l’espace fine insécable devant les signes : ; ? et !
}
```

Pour NestJS, il faut aussi désactiver la règle `no-unused-vars` pour les **injections de dépendances**, autrement dit surcharger les valeurs pour ces 2 règles :

```javascript
rules: {
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': 'off',  // Si vous n’utilisez pas @antfu/eslint-config
  // 'ts/no-unused-vars': 'off', // Si vous utilisez @antfu/eslint-config
}
```

Plus de [détails ici](../outils/eslint.md).
