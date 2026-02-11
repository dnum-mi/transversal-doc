# Workflows réutilisables

La Fabrique Numérique maintient un catalogue de **workflows GitHub Actions réutilisables** dans le dépôt [`dnum-mi/fabnum-cicd`](https://github.com/dnum-mi/fabnum-cicd). Ces workflows sont maintenus par l'équipe DevOps et **doivent être privilégiés** par rapport à des pipelines écrits from scratch.

::: tip Recommandation forte
Utiliser les workflows réutilisables plutôt que de réécrire vos propres pipelines. Cela garantit la cohérence entre les projets, la maintenance centralisée et l'application des bonnes pratiques de sécurité.
:::

## Pourquoi les utiliser ?

- **Maintenance centralisée** : les corrections et améliorations profitent automatiquement à tous les projets
- **Standardisation** : même structure de pipeline pour tous les projets de la Fabrique Numérique
- **Sécurité** : les scans Trivy et SonarQube sont préconfigurés avec les bonnes pratiques
- **Simplicité** : quelques lignes de YAML suffisent pour avoir un pipeline complet

## Workflows disponibles

| Workflow                                                                                                           | Description                                              |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| [`build-docker.yml`](https://github.com/dnum-mi/fabnum-cicd/blob/main/docs/workflows/02-build-docker.md)           | Build et push d'images Docker multi-architecture         |
| [`clean-cache.yml`](https://github.com/dnum-mi/fabnum-cicd/blob/main/docs/workflows/03-clean-cache.md)             | Nettoyage du cache GitHub Actions et des images GHCR     |
| [`lint-commits.yml`](https://github.com/dnum-mi/fabnum-cicd/blob/main/docs/workflows/04-lint-commits.md)           | Validation des messages de commit (Conventional Commits) |
| [`lint-helm.yml`](https://github.com/dnum-mi/fabnum-cicd/blob/main/docs/workflows/05-lint-helm.md)                 | Lint des charts Helm avec chart-testing                  |
| [`release-app.yml`](https://github.com/dnum-mi/fabnum-cicd/blob/main/docs/workflows/06-release-app.md)             | Gestion automatisée des releases avec release-please     |
| [`release-helm.yml`](https://github.com/dnum-mi/fabnum-cicd/blob/main/docs/workflows/07-release-helm.md)           | Publication de charts Helm sur registres OCI             |
| [`scan-sonarqube.yml`](https://github.com/dnum-mi/fabnum-cicd/blob/main/docs/workflows/08-scan-sonarqube.md)       | Analyse de qualité du code avec SonarQube                |
| [`scan-trivy.yml`](https://github.com/dnum-mi/fabnum-cicd/blob/main/docs/workflows/09-scan-trivy.md)               | Analyse de vulnérabilités avec Trivy                     |
| [`sync-cpin.yml`](https://github.com/dnum-mi/fabnum-cicd/blob/main/docs/workflows/10-sync-cpin.md)                 | Synchronisation avec l'instance GitLab CPiN              |
| [`test-helm.yml`](https://github.com/dnum-mi/fabnum-cicd/blob/main/docs/workflows/11-test-helm.md)                 | Test d'installation des charts Helm dans Kind            |
| [`update-helm-chart.yml`](https://github.com/dnum-mi/fabnum-cicd/blob/main/docs/workflows/12-update-helm-chart.md) | Mise à jour automatique des versions de charts Helm      |

## Utilisation rapide

Pour utiliser un workflow réutilisable, il suffit d'utiliser le mot-clé `uses` dans votre fichier de workflow :

```yaml
jobs:
  mon-job:
    uses: dnum-mi/fabnum-cicd/.github/workflows/<nom-du-workflow>.yml@main
    with:
      # inputs du workflow
    secrets:
      # secrets nécessaires
```

## Exemple : pipeline CI minimal

Voici un pipeline CI minimal utilisant les workflows réutilisables pour un projet standard :

```yaml
name: CI

on:
  pull_request:
    branches: ["**"]

jobs:
  lint-commits:
    uses: dnum-mi/fabnum-cicd/.github/workflows/lint-commits.yml@main

  scan-sonarqube:
    uses: dnum-mi/fabnum-cicd/.github/workflows/scan-sonarqube.yml@main
    permissions:
      issues: write
      pull-requests: write
      contents: read
    with:
      SONAR_URL: https://sonarqube.example.com
      SOURCES_PATH: apps
    secrets:
      SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
      SONAR_PROJECT_KEY: ${{ secrets.SONAR_PROJECT_KEY }}

  build-docker:
    uses: dnum-mi/fabnum-cicd/.github/workflows/build-docker.yml@main
    permissions:
      packages: write
      contents: read
    with:
      IMAGE_NAME: ghcr.io/${{ github.repository }}/my-app
      IMAGE_TAG: pr-${{ github.event.pull_request.number }}
      IMAGE_CONTEXT: ./
      IMAGE_DOCKERFILE: ./Dockerfile

  scan-trivy:
    needs: build-docker
    uses: dnum-mi/fabnum-cicd/.github/workflows/scan-trivy.yml@main
    permissions:
      contents: read
      security-events: write
      pull-requests: write
      packages: read
    with:
      IMAGE: ghcr.io/${{ github.repository }}/my-app:pr-${{ github.event.pull_request.number }}
      PR_NUMBER: ${{ github.event.pull_request.number }}
```

## Exemple : pipeline CD avec release

```yaml
name: CD

on:
  push:
    branches: [main, develop]

jobs:
  release:
    uses: dnum-mi/fabnum-cicd/.github/workflows/release-app.yml@main
    permissions:
      issues: write
      pull-requests: write
      contents: write
    with:
      ENABLE_PRERELEASE: true
      TAG_MAJOR_AND_MINOR: true
      AUTOMERGE_PRERELEASE: true
    secrets:
      GH_PAT: ${{ secrets.GH_PAT }}

  build-docker:
    uses: dnum-mi/fabnum-cicd/.github/workflows/build-docker.yml@main
    if: ${{ needs.release.outputs.release-created == 'true' }}
    needs: release
    permissions:
      packages: write
      contents: read
    with:
      IMAGE_NAME: ghcr.io/${{ github.repository }}/my-app
      IMAGE_TAG: ${{ needs.release.outputs.version }}
      IMAGE_CONTEXT: ./
      IMAGE_DOCKERFILE: ./Dockerfile
```

## Secrets requis

Certains workflows nécessitent des secrets GitHub configurés dans votre dépôt :

| Secret              | Workflows concernés                | Description                        |
| ------------------- | ---------------------------------- | ---------------------------------- |
| `GH_PAT`            | `release-app`, `update-helm-chart` | GitHub Personal Access Token       |
| `SONAR_TOKEN`       | `scan-sonarqube`                   | Token d'authentification SonarQube |
| `SONAR_PROJECT_KEY` | `scan-sonarqube`                   | Clé du projet SonarQube            |
| `GIT_MIRROR_TOKEN`  | `sync-cpin`                        | Token GitLab pour synchronisation  |

::: info Documentation complète
La documentation détaillée de chaque workflow (inputs, outputs, permissions, exemples avancés) est disponible dans le [dépôt fabnum-cicd](https://github.com/dnum-mi/fabnum-cicd/tree/main/docs/workflows).
:::
