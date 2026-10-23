# Exemples de pipelines (Github Actions)

Quelques exemples de pipelines très complets avec les Github Actions, construits sur les [workflows réutilisables](/ci-cd/workflows-reutilisables) du dépôt [`dnum-mi/fabnum-cicd`](https://github.com/dnum-mi/fabnum-cicd). N'hésitez pas à retirer les parties ne concernant pas votre projet.

Les workflows réutilisables couvrent tout ce qui est commun aux projets de la Fabrique Numérique :

| Besoin                                   | Workflow réutilisable                                                                                      |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Validation des messages de commit        | [`lint-commits`](https://github.com/dnum-mi/fabnum-cicd/blob/main/docs/workflows/10-lint-commits.md)       |
| Analyse de qualité (SonarQube)           | [`scan-sonarqube`](https://github.com/dnum-mi/fabnum-cicd/blob/main/docs/workflows/40-scan-sonarqube.md)   |
| Build et push de l'image Docker          | [`build-docker`](https://github.com/dnum-mi/fabnum-cicd/blob/main/docs/workflows/30-build-docker.md)       |
| Scan de vulnérabilités (images, config)  | [`scan-trivy`](https://github.com/dnum-mi/fabnum-cicd/blob/main/docs/workflows/41-scan-trivy.md)           |
| Check unique exigible par la protection de branche | [`check-jobs`](https://github.com/dnum-mi/fabnum-cicd/blob/main/docs/workflows/80-check-jobs.md) |
| Release (tags, changelog)                | [`release-app`](https://github.com/dnum-mi/fabnum-cicd/blob/main/docs/workflows/50-release-app.md)         |

Les jobs propres à la stack du projet (ici lint et tests d'un monorepo Node avec pnpm) restent écrits dans le dépôt : il n'existe pas de workflow réutilisable pour eux.

> *__Notes:__ Ne pas oublier de définir les commandes `test`, `test:ct-ci` et `test:e2e-ci` dans votre `package.json`.*

::: tip Version des workflows
Les exemples référencent les workflows avec `@v0`, le tag qui suit les dernières versions `0.x` du dépôt. Pour figer une version précise, utiliser un tag complet (`@v0.24.1`) ou un SHA de commit.
:::

## Intégration continue (CI)

Prérequis dans les paramètres du dépôt (**Settings > Secrets and variables > Actions**) :

- les secrets `SONAR_TOKEN` et `SONAR_PROJECT_KEY` et la variable `SONAR_URL` (retirer le job `scan-sonarqube` si le projet n'utilise pas SonarQube) ;
- aucun autre secret : la construction et le push de l'image vers GHCR, ainsi que les scans Trivy, utilisent le `GITHUB_TOKEN` fourni automatiquement.

```yaml
name: CI

on:
  pull_request:
    types:
      - opened
      - reopened
      - synchronize
      - ready_for_review
    branches:
      - "**"
  workflow_dispatch:

env:
  NODE_VERSION: "24.22.1"
  PNPM_VERSION: "10"
  BUILD_AMD64: true
  BUILD_ARM64: false
  USE_QEMU: false
  IMAGE_NAME: my-app
  IMAGE_TAG: pr-${{ github.event.pull_request.number || github.event.number }}
  BROWSERS: ${{ github.base_ref == 'main' && fromJson('["electron", "firefox"]') || fromJson('["electron"]') }}

jobs:
  # Le contexte `env` n'est pas accessible dans les `with:` d'un workflow réutilisable : les valeurs sont exposées en outputs
  expose-vars:
    runs-on: ubuntu-latest
    if: ${{ !github.event.pull_request.draft }}
    outputs:
      NODE_VERSION: ${{ env.NODE_VERSION }}
      PNPM_VERSION: ${{ env.PNPM_VERSION }}
      BUILD_AMD64: ${{ env.BUILD_AMD64 }}
      BUILD_ARM64: ${{ env.BUILD_ARM64 }}
      USE_QEMU: ${{ env.USE_QEMU }}
      IMAGE_NAME: ${{ env.IMAGE_NAME }}
      IMAGE_TAG: ${{ env.IMAGE_TAG }}
      BROWSERS: ${{ env.BROWSERS }}
    steps:
      - name: Exposing env vars
        run: echo "Exposing env vars"

  lint-commits:
    needs:
      - expose-vars
    uses: dnum-mi/fabnum-cicd/.github/workflows/lint-commits.yml@v0
    permissions:
      pull-requests: read
      contents: read

  lint:
    name: Lint codebase
    runs-on: ubuntu-latest
    needs:
      - expose-vars
    steps:
      - name: Checks-out repository
        uses: actions/checkout@v6

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        id: pnpm-install
        with:
          version: "${{ needs.expose-vars.outputs.PNPM_VERSION }}"
          run_install: false

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: "${{ needs.expose-vars.outputs.NODE_VERSION }}"

      - name: Get pnpm store directory
        id: pnpm-store
        run: |
          echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT

      - name: Cache node files
        uses: actions/cache@v5
        with:
          path: |
            ${{ steps.pnpm-store.outputs.STORE_PATH }}
          key: node-${{ runner.os }}-${{ runner.arch }}-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            node-${{ runner.os }}-${{ runner.arch }}-

      - name: Cache turbo files
        uses: actions/cache@v5
        with:
          path: |
            ./.turbo/cache
          key: turbo-lint-${{ runner.os }}-${{ runner.arch }}-${{ hashFiles('apps/**/src/**','packages/**/src/**') }}
          restore-keys: |
            turbo-lint-${{ runner.os }}-${{ runner.arch }}-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Check lint error
        run: pnpm run lint

  unit-tests:
    name: Unit tests
    runs-on: ubuntu-latest
    needs:
      - expose-vars
    steps:
      - name: Checks-out repository
        uses: actions/checkout@v6

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        id: pnpm-install
        with:
          version: "${{ needs.expose-vars.outputs.PNPM_VERSION }}"
          run_install: false

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: "${{ needs.expose-vars.outputs.NODE_VERSION }}"

      - name: Get pnpm store directory
        id: pnpm-store
        run: |
          echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT

      - name: Cache node files
        uses: actions/cache@v5
        with:
          path: |
            ${{ steps.pnpm-store.outputs.STORE_PATH }}
          key: node-${{ runner.os }}-${{ runner.arch }}-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            node-${{ runner.os }}-${{ runner.arch }}-

      - name: Cache turbo files
        uses: actions/cache@v5
        with:
          path: |
            ./.turbo/cache
            ./**/coverage
          key: turbo-unit-${{ runner.os }}-${{ runner.arch }}-${{ hashFiles('src/**') }}
          restore-keys: |
            turbo-unit-${{ runner.os }}-${{ runner.arch }}-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run unit tests
        run: pnpm run test

      - name: Upload vitest coverage artifacts
        uses: actions/upload-artifact@v6
        with:
          name: unit-tests-coverage
          path: |
            ./**/coverage/lcov.info
          retention-days: 1

  scan-sonarqube:
    needs:
      - expose-vars
      - unit-tests
    uses: dnum-mi/fabnum-cicd/.github/workflows/scan-sonarqube.yml@v0
    permissions:
      issues: write
      pull-requests: write
      contents: read
    with:
      SONAR_URL: ${{ vars.SONAR_URL }}
      SOURCES_PATH: apps,packages
      # Importe l'artefact `unit-tests-coverage` publié par le job `unit-tests`
      COVERAGE_IMPORT: true
      SONAR_EXTRA_ARGS: >-
        -Dsonar.javascript.node.maxspace=4096
        -Dsonar.javascript.lcov.reportPaths=coverage/apps/server/coverage/lcov.info,coverage/apps/client/coverage/lcov.info,coverage/packages/shared/coverage/lcov.info
        -Dsonar.coverage.exclusions=**/*.spec.js,**/*.spec.ts,**/*.vue,**/assets/**,**/playwright/**,**/packages/test-utils/**,apps/server/src/plugins/**
        -Dsonar.cpd.exclusions=**/*.spec.js,**/*.spec.ts,**/playwright/**
    secrets:
      SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
      SONAR_PROJECT_KEY: ${{ secrets.SONAR_PROJECT_KEY }}

  component-tests:
    runs-on: ubuntu-latest
    needs:
      - expose-vars
    strategy:
      matrix:
        browsers: "${{ github.base_ref == 'main' && 'electron,firefox' || 'electron' }}"
    steps:
      - name: Checks-out repository
        uses: actions/checkout@v6

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        id: pnpm-install
        with:
          version: "${{ needs.expose-vars.outputs.PNPM_VERSION }}"
          run_install: false

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: "${{ needs.expose-vars.outputs.NODE_VERSION }}"

      - name: Setup firefox
        uses: browser-actions/setup-firefox@v1
        if: ${{ matrix.browsers == 'firefox' }}

      - name: Setup chrome
        uses: browser-actions/setup-chrome@v2
        if: ${{ matrix.browsers == 'chrome' }}

      - name: Setup edge
        uses: browser-actions/setup-edge@v1
        if: ${{ matrix.browsers == 'edge' }}

      - name: Get pnpm store directory
        id: pnpm-store
        run: |
          echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT

      - name: Cache node files
        uses: actions/cache@v5
        with:
          path: |
            ${{ steps.pnpm-store.outputs.STORE_PATH }}
            /home/runner/.cache/ms-playwright
          key: node-${{ runner.os }}-${{ runner.arch }}-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            node-${{ runner.os }}-${{ runner.arch }}-

      - name: Cache turbo files
        uses: actions/cache@v5
        with:
          path: |
            ./.turbo/cache
          key: turbo-component-${{ runner.os }}-${{ runner.arch }}-${{ matrix.browsers }}-${{ hashFiles('apps/**/src/**','apps/client/playwright/**','packages/**/src/**') }}
          restore-keys: |
            turbo-component-${{ runner.os }}-${{ runner.arch }}-${{ matrix.browsers }}-
            turbo-component-${{ runner.os }}-${{ runner.arch }}-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run component tests
        run: pnpm run test:ct-ci -- --browser "${{ matrix.browsers }}"

      - name: Upload playwright artifacts
        if: ${{ failure() }}
        uses: actions/upload-artifact@v6
        with:
          name: playwright-report
          path: ./playwright-report/
          retention-days: 14

  build-docker:
    needs:
      - expose-vars
    uses: dnum-mi/fabnum-cicd/.github/workflows/build-docker.yml@v0
    permissions:
      packages: write
      contents: read
    with:
      IMAGE_NAME: ghcr.io/${{ github.repository }}/${{ needs.expose-vars.outputs.IMAGE_NAME }}
      IMAGE_TAG: ${{ needs.expose-vars.outputs.IMAGE_TAG }}
      IMAGE_CONTEXT: ./
      IMAGE_DOCKERFILE: ./Dockerfile
      BUILD_AMD64: ${{ needs.expose-vars.outputs.BUILD_AMD64 == 'true' }}
      BUILD_ARM64: ${{ needs.expose-vars.outputs.BUILD_ARM64 == 'true' }}
      USE_QEMU: ${{ needs.expose-vars.outputs.USE_QEMU == 'true' }}
      BUILD_ARGS: APP_VERSION=${{ needs.expose-vars.outputs.IMAGE_TAG }}
      CACHE: true

  e2e-tests:
    name: End to end tests
    runs-on: ubuntu-latest
    needs:
      - expose-vars
      - build-docker
    strategy:
      matrix:
        browsers: ${{ needs.expose-vars.outputs.BROWSERS }}
    steps:
      - name: Checks-out repository
        uses: actions/checkout@v6

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        id: pnpm-install
        with:
          version: "${{ needs.expose-vars.outputs.PNPM_VERSION }}"
          run_install: false

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: "${{ needs.expose-vars.outputs.NODE_VERSION }}"

      - name: Setup firefox
        uses: browser-actions/setup-firefox@v1
        if: ${{ matrix.browsers == 'firefox' }}

      - name: Setup chrome
        uses: browser-actions/setup-chrome@v2
        if: ${{ matrix.browsers == 'chrome' }}

      - name: Setup edge
        uses: browser-actions/setup-edge@v1
        if: ${{ matrix.browsers == 'edge' }}

      - name: Get pnpm store directory
        id: pnpm-store
        run: |
          echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT

      - name: Cache node files
        uses: actions/cache@v5
        with:
          path: |
            ${{ steps.pnpm-store.outputs.STORE_PATH }}
            /home/runner/.cache/ms-playwright
          key: node-${{ runner.os }}-${{ runner.arch }}-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            node-${{ runner.os }}-${{ runner.arch }}-

      - name: Cache turbo files
        uses: actions/cache@v5
        with:
          path: |
            ./.turbo/cache
          key: turbo-e2e-${{ runner.os }}-${{ runner.arch }}-${{ matrix.browsers }}-${{ hashFiles('src/**') }}
          restore-keys: |
            turbo-e2e-${{ runner.os }}-${{ runner.arch }}-${{ matrix.browsers }}-
            turbo-e2e-${{ runner.os }}-${{ runner.arch }}-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run e2e tests
        run: pnpm run test:e2e-ci -- --browser "${{ matrix.browsers }}"

      - name: Upload playwright artifacts
        if: ${{ failure() }}
        uses: actions/upload-artifact@v6
        with:
          name: playwright-report
          path: ./playwright-report/
          retention-days: 14

  scan-trivy-image:
    needs:
      - expose-vars
      - build-docker
    uses: dnum-mi/fabnum-cicd/.github/workflows/scan-trivy.yml@v0
    permissions:
      contents: read
      security-events: write
      pull-requests: write
      packages: read
    with:
      IMAGE: ${{ needs.build-docker.outputs.image }}:${{ needs.expose-vars.outputs.IMAGE_TAG }}
      PR_NUMBER: ${{ github.event.pull_request.number || github.event.number || '' }}

  scan-trivy-config:
    needs:
      - expose-vars
    uses: dnum-mi/fabnum-cicd/.github/workflows/scan-trivy.yml@v0
    permissions:
      contents: read
      security-events: write
      pull-requests: write
      packages: read
    with:
      PATH: ./
      PR_NUMBER: ${{ github.event.pull_request.number || github.event.number || '' }}

  # Workaround for required status check in protection branches (see. https://github.com/orgs/community/discussions/13690)
  # `needs:` doit lister TOUS les jobs du pipeline : un job absent peut échouer sans bloquer la pull request
  all-jobs-passed:
    name: Check jobs status
    if: ${{ always() }}
    needs:
      - expose-vars
      - lint-commits
      - lint
      - unit-tests
      - scan-sonarqube
      - component-tests
      - build-docker
      - e2e-tests
      - scan-trivy-image
      - scan-trivy-config
    uses: dnum-mi/fabnum-cicd/.github/workflows/check-jobs.yml@v0
    with:
      NEEDS: ${{ toJson(needs) }}
```

::: warning Check requis
Le check à exiger dans la protection de branche est `Check jobs status / Required jobs` (les checks d'un workflow réutilisable sont préfixés par le nom du job appelant). Voir la [documentation de `check-jobs`](https://github.com/dnum-mi/fabnum-cicd/blob/main/docs/workflows/80-check-jobs.md) pour migrer un gate existant sans bloquer les pull requests en cours.
:::

## Déploiement continu (CD)

Le workflow `release-app` s'appuie sur [release-please](https://github.com/googleapis/release-please) : il ouvre une pull request de release à partir des commits conventionnels, puis crée le tag et la release GitHub quand celle-ci est fusionnée. Il lit sa configuration dans deux fichiers à la racine du dépôt.

`release-please-config.json` :

```json
{
  "$schema": "https://raw.githubusercontent.com/googleapis/release-please/main/schemas/config.json",
  "packages": {
    ".": {
      "release-type": "node",
      "initial-version": "0.0.1",
      "include-component-in-tag": false
    }
  }
}
```

`.release-please-manifest.json` (à initialiser avec la version courante, release-please le met ensuite à jour) :

```json
{
  ".": "0.0.1"
}
```

```yaml
name: CD

on:
  push:
    branches:
      - main

env:
  BUILD_AMD64: true
  BUILD_ARM64: true
  USE_QEMU: false
  IMAGE_NAME: my-app

jobs:
  expose-vars:
    runs-on: ubuntu-latest
    outputs:
      BUILD_AMD64: ${{ env.BUILD_AMD64 }}
      BUILD_ARM64: ${{ env.BUILD_ARM64 }}
      USE_QEMU: ${{ env.USE_QEMU }}
      IMAGE_NAME: ${{ env.IMAGE_NAME }}
    steps:
      - name: Exposing env vars
        run: echo "Exposing env vars"

  release:
    name: Create new release
    needs:
      - expose-vars
    uses: dnum-mi/fabnum-cicd/.github/workflows/release-app.yml@v0
    permissions:
      issues: write
      pull-requests: write
      contents: write
    # Sans credential, la pull request de release est ouverte avec le GITHUB_TOKEN et ne déclenche pas la CI.
    # Pour qu'elle la déclenche (ou pour l'automerge), fournir une GitHub App (ou un GH_PAT) :
    # secrets:
    #   APP_CLIENT_ID: ${{ secrets.APP_CLIENT_ID }}
    #   APP_PRIVATE_KEY: ${{ secrets.APP_PRIVATE_KEY }}

  build-docker:
    name: Build application
    if: ${{ needs.release.outputs.release-created == 'true' }}
    needs:
      - expose-vars
      - release
    uses: dnum-mi/fabnum-cicd/.github/workflows/build-docker.yml@v0
    permissions:
      packages: write
      contents: read
    with:
      IMAGE_NAME: ghcr.io/${{ github.repository }}/${{ needs.expose-vars.outputs.IMAGE_NAME }}
      IMAGE_TAG: ${{ needs.release.outputs.version }}
      IMAGE_CONTEXT: ./
      IMAGE_DOCKERFILE: ./Dockerfile
      BUILD_AMD64: ${{ needs.expose-vars.outputs.BUILD_AMD64 == 'true' }}
      BUILD_ARM64: ${{ needs.expose-vars.outputs.BUILD_ARM64 == 'true' }}
      USE_QEMU: ${{ needs.expose-vars.outputs.USE_QEMU == 'true' }}
      LATEST_TAG: true
      CACHE: true
```

::: info Aller plus loin
Les workflows réutilisables couvrent aussi les pré-releases (`ENABLE_PRERELEASE`), la mise à jour d'un chart Helm (`dispatch-helm-chart`, `update-helm-chart`), la publication de charts et de paquets npm, les attestations de sécurité (`attest-docker`) ou l'audit des workflows (`scan-zizmor`). La [documentation de chaque workflow](https://github.com/dnum-mi/fabnum-cicd/tree/main/docs/workflows) détaille ses inputs, outputs, secrets et permissions, avec des pipelines complets par cas d'usage.
:::
