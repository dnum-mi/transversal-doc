# Conventions de lint et formattage

Ce document couvre les conventions de lint et de formattage pour les projets JavaScript/TypeScript et Python.

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

Pour les projets JavaScript/TypeScript, utiliser [ESLint](https://eslint.org/) avec la [configuration d'Anthony Fu](https://eslint-config.antfu.me/) (`@antfu/eslint-config`) qui gère à la fois le linting et le formattage.

### Installation

```shell
pnpm add -D eslint @antfu/eslint-config
```

### Configuration

Créer un fichier `eslint.config.js` à la racine du projet :

```javascript
import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'style/comma-dangle': ['error', 'always-multiline'],
    'no-irregular-whitespace': 'off',
  },
})
```

Les règles suivantes doivent être surchargées :

- [`style/comma-dangle`](https://eslint.style/rules/default/comma-dangle) : `['error', 'always-multiline']`
- [`no-irregular-whitespace`](https://eslint.org/docs/latest/rules/no-irregular-whitespace) : `'off'` (pour permettre l'espace fine insécable)

Pour **NestJS**, activer le support des décorateurs dans le `tsconfig.json` :

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "moduleResolution": "node"
  }
}
```

Et ajuster certaines règles ESLint :

```javascript
rules: {
  '@typescript-eslint/no-unused-vars': 'warn',
  '@typescript-eslint/no-explicit-any': 'off',
}
```

### Intégration VS Code

Ajouter dans `.vscode/settings.json` :

```json
{
  "[javascript][typescript][vue]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  }
}
```

### CI/CD

Exemple pour GitHub Actions :

```yaml
- name: Lint JS/TS
  run: pnpm eslint .
```

### Points importants

- **ESLint remplace Prettier** : avec `@antfu/eslint-config`, pas besoin d'installer Prettier séparément pour JS/TS
- **Flat config** : depuis ESLint v9, la configuration est un fichier `eslint.config.js` (plus de `.eslintrc`)
- **Stylistic** : les règles de style sont préfixées `style/` via `@stylistic/eslint-plugin`

Plus de [détails ici](../stack/eslint).

## Lint avec Ruff

Pour les projets Python, utiliser [Ruff](https://docs.astral.sh/ruff/) — un linter et formatter ultra-rapide (écrit en Rust) qui remplace `black`, `flake8`, `isort`, `pyupgrade` et autres outils traditionnels.

### Installation

Avec `uv` (recommandé) :

```shell
uv add --dev ruff
```

### Configuration

Créer un fichier `ruff.toml` à la racine du projet ou ajouter la configuration dans `pyproject.toml` :

```toml
[tool.ruff]
# Longueur de ligne maximale
line-length = 88

# Version Python cible
target-version = "py312"

[tool.ruff.lint]
# Règles activées (équivalent flake8, isort, pyupgrade...)
select = [
  "E",      # pycodestyle errors
  "W",      # pycodestyle warnings
  "F",      # pyflakes
  "I",      # isort
  "N",      # pep8-naming
  "UP",     # pyupgrade
  "B",      # flake8-bugbear
  "C4",     # flake8-comprehensions
  "SIM",    # flake8-simplify
]

# Règles ignorées
ignore = [
  "E501",   # line-too-long (géré par le formatter)
]

[tool.ruff.format]
# Guillemets doubles par défaut
quote-style = "double"

# Indentation : espaces
indent-style = "space"
```

### Intégration VS Code

Ajouter dans `.vscode/settings.json` :

```json
{
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll": "explicit",
      "source.organizeImports": "explicit"
    }
  }
}
```

### CI/CD

Exemple pour GitHub Actions :

```yaml
- name: Lint Python
  run: |
    uv run ruff check .
    uv run ruff format --check .
```

### Points importants

- **Ruff remplace black** : pas besoin d'installer black séparément
- **Ruff remplace isort** : l'import sorting est intégré (règle `I`)
- **Ultra-rapide** : 10-100x plus rapide que les outils traditionnels
- **Compatible** : respecte les conventions black et isort par défaut
