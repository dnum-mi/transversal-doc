# Examples de pipelines (Github Actions)

Quelques exemples de pipelines très complets avec les Github Actions, n'hésitez pas à retirer les parties ne concernant pas votre projet.

> *__Notes:__ Ne pas oublier de définir les commandes `test`, `test:ct-ci` et `test:e2e-ci` dans votre `package.json`.*

## Intégration continue (CI)

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
  NODE_VERSION: "20.10.0"
  PNPM_VERSION: "8"
  REGISTRY: "ghcr.io"
  MULTI_ARCH: false
  USE_QEMU: false
  IMAGE_NAME: my-app
  TAG: pr-${{ github.event.pull_request.number || github.event.number }}
  BROWSERS: ${{ github.base_ref == 'main' && fromJson('["electron", "firefox"]') || fromJson('["electron"]') }}

jobs:
  expose-vars:
    runs-on: ubuntu-latest
    if: ${{ !github.event.pull_request.draft }}
    outputs:
      NODE_VERSION: ${{ env.NODE_VERSION }}
      PNPM_VERSION: ${{ env.PNPM_VERSION }}
      REGISTRY: ${{ env.REGISTRY }}
      NAMESPACE: ${{ env.GITHUB_REPOSITORY_OWNER }}
      MULTI_ARCH: ${{ env.MULTI_ARCH }}
      USE_QEMU: ${{ env.USE_QEMU }}
      IMAGE_NAME: ${{ env.IMAGE_NAME }}
      TAG: ${{ env.TAG }}
      BROWSERS: ${{ env.BROWSERS }}
    steps:
      - name: Exposing env vars
        run: echo "Exposing env vars"

  lint:
    name: Lint codebase
    runs-on: ubuntu-latest
    needs:
      - expose-vars
    steps:
      - name: Checks-out repository
        uses: actions/checkout@v3

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        id: pnpm-install
        with:
          version: "${{ needs.expose-vars.outputs.PNPM_VERSION }}"
          run_install: false

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "${{ needs.expose-vars.outputs.NODE_VERSION }}"

      - name: Get pnpm store directory
        id: pnpm-store
        run: |
          echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT

      - name: Cache node files
        uses: actions/cache@v3
        with:
          path: |
            ${{ steps.pnpm-store.outputs.STORE_PATH }}
          key: node-${{ runner.os }}-${{ runner.arch }}-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            node-${{ runner.os }}-${{ runner.arch }}-

      - name: Cache turbo files
        uses: actions/cache@v3
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
        uses: actions/checkout@v3

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        id: pnpm-install
        with:
          version: "${{ needs.expose-vars.outputs.PNPM_VERSION }}"
          run_install: false

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "${{ needs.expose-vars.outputs.NODE_VERSION }}"

      - name: Get pnpm store directory
        id: pnpm-store
        run: |
          echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT

      - name: Cache node files
        uses: actions/cache@v3
        with:
          path: |
            ${{ steps.pnpm-store.outputs.STORE_PATH }}
          key: node-${{ runner.os }}-${{ runner.arch }}-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            node-${{ runner.os }}-${{ runner.arch }}-

      - name: Cache turbo files
        uses: actions/cache@v3
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
        uses: actions/upload-artifact@v3
        with:
          name: unit-tests-coverage
          path: |
            ./**/coverage/lcov.info
          retention-days: 1

      - name: Check for sonar secrets
        id: check-secrets
        run: |
          if [ "${{ secrets.SONAR_HOST_URL }}" != "" ] && [ "${{ secrets.SONAR_TOKEN }}" != "" ] && [ "${{ secrets.SONAR_PROJECT_KEY }}" != "" ]; then
            echo "run-scan=true" >> $GITHUB_OUTPUT
          else
            echo "run-scan=false" >> $GITHUB_OUTPUT
          fi

      - name: Set sonarqube args
        if: ${{ steps.check-secrets.outputs.run-scan == 'true' }}
        id: sonar-args
        run: |
          echo "SONAR_ARGS_PR=-Dsonar.pullrequest.provider=github -Dsonar.pullrequest.key=${{ github.event.number }} -Dsonar.pullrequest.branch=${{ github.head_ref }} -Dsonar.pullrequest.base=${{ github.base_ref }} -Dsonar.pullrequest.github.repository=${{ github.repository }}" >> $GITHUB_OUTPUT
          echo "SONAR_ARGS_BRANCH=-Dsonar.branch.name=${{ github.ref_name }}" >> $GITHUB_OUTPUT

      - name: SonarQube Scan
        if: ${{ steps.check-secrets.outputs.run-scan == 'true' }}
        uses: sonarsource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          args: >
            -Dsonar.projectKey=${{ secrets.SONAR_PROJECT_KEY }}
            -Dsonar.sources=apps,packages
            -Dsonar.javascript.node.maxspace=4096
            -Dsonar.javascript.lcov.reportPaths=coverage/apps/server/coverage/lcov.info,coverage/apps/client/coverage/lcov.info,coverage/packages/shared/coverage/lcov.info
            -Dsonar.coverage.exclusions=**/*.spec.js,**/*.spec.ts,**/*.vue,**/assets/**,**/cypress/**,**/packages/test-utils/**,apps/server/src/plugins/**
            -Dsonar.cpd.exclusions=**/*.spec.js,**/*.spec.ts,**/cypress/**
            -Dsonar.scm.provider=git
            ${{ github.event_name == 'pull_request' && steps.sonar-args.outputs.SONAR_ARGS_PR || steps.sonar-args.outputs.SONAR_ARGS_BRANCH }}
        continue-on-error: true

      - name: SonarQube Quality Gate check
        if: ${{ steps.check-secrets.outputs.run-scan == 'true' }}
        id: sonarqube-quality-gate-check
        uses: sonarsource/sonarqube-quality-gate-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
        timeout-minutes: 5
        continue-on-error: true

  component-tests:
    runs-on: ubuntu-latest
    needs:
      - expose-vars
    strategy:
      matrix:
        browsers: "${{ github.base_ref == 'main' && 'electron,firefox' || 'electron' }}"
    steps:
      - name: Checks-out repository
        uses: actions/checkout@v3

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        id: pnpm-install
        with:
          version: "${{ needs.expose-vars.outputs.PNPM_VERSION }}"
          run_install: false

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "${{ needs.expose-vars.outputs.NODE_VERSION }}"

      - name: Setup firefox
        uses: browser-actions/setup-firefox@v1
        if: ${{ matrix.browsers == 'firefox' }}

      - name: Setup chrome
        uses: browser-actions/setup-chrome@v1
        if: ${{ matrix.browsers == 'chrome' }}

      - name: Setup edge
        uses: browser-actions/setup-edge@v1
        if: ${{ matrix.browsers == 'edge' }}

      - name: Get pnpm store directory
        id: pnpm-store
        run: |
          echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT

      - name: Cache node files
        uses: actions/cache@v3
        with:
          path: |
            ${{ steps.pnpm-store.outputs.STORE_PATH }}
            /home/runner/.cache/Cypress
          key: node-${{ runner.os }}-${{ runner.arch }}-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            node-${{ runner.os }}-${{ runner.arch }}-

      - name: Cache turbo files
        uses: actions/cache@v3
        with:
          path: |
            ./.turbo/cache
          key: turbo-component-${{ runner.os }}-${{ runner.arch }}-${{ matrix.browsers }}-${{ hashFiles('apps/**/src/**','apps/client/cypress/**','packages/**/src/**') }}
          restore-keys: |
            turbo-component-${{ runner.os }}-${{ runner.arch }}-${{ matrix.browsers }}-
            turbo-component-${{ runner.os }}-${{ runner.arch }}-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run component tests
        run: pnpm run test:ct-ci -- --browser "${{ matrix.browsers }}"

      - name: Upload cypress artifacts
        if: ${{ failure() }}
        uses: actions/upload-artifact@v3
        with:
          name: cypress-report
          path: ./cypress/components/screenshots/
          retention-days: 14

  pre-build:
    name: Generate matrix for build & scan
    runs-on: ubuntu-latest
    needs:
      - expose-vars
    outputs:
      lower-branch: ${{ steps.get-infos.outputs.LOWER_BRANCH }}
      short-sha: ${{ steps.get-infos.outputs.SHORT_SHA }}
    steps:
      - name: Checks-out repository
        uses: actions/checkout@v3

      - name: Generate matrix for build
        id: get-infos
        run: |
          echo "LOWER_BRANCH=$(echo '${{ github.head_ref }}' | sed 's/\//-/g' | tr '[:upper:]' '[:lower:]')" >> $GITHUB_OUTPUT
          echo "SHORT_SHA=sha-$(git rev-parse --short HEAD)" >> $GITHUB_OUTPUT

  build:
    name: Build application
    runs-on: ${{ matrix.runners }}
    needs:
      - expose-vars
      - pre-build
    strategy:
      matrix:
        runners: ${{ needs.expose-vars.outputs.MULTI_ARCH && !needs.expose-vars.outputs.USE_QEMU && fromJson('["ubuntu-latest", "ARM64"]') || fromJson('["ubuntu-latest"]') }}
    steps:
      - name: Checks-out repository
        uses: actions/checkout@v3

      - name: Set up Docker buildx
        uses: docker/setup-buildx-action@v2

      - name: Cache Docker layers
        uses: actions/cache@v3
        with:
          path: /tmp/.buildx-cache
          key: buildx-${{ runner.os }}-${{ runner.arch }}-${{ hashFiles('src/**') }}
          restore-keys: |
            buildx-${{ runner.os }}-${{ runner.arch }}-

      - name: Set up QEMU (for multi platform build)
        uses: docker/setup-qemu-action@v2
        if: ${{ needs.expose-vars.outputs.USE_QEMU }}

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ needs.expose-vars.outputs.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
          logout: true

      - name: Build and push docker image
        id: build
        uses: docker/build-push-action@v4
        with:
          context: ./
          file: ./Dockerfile
          provenance: false
          platforms: ${{ needs.expose-vars.outputs.MULTI_ARCH && needs.expose-vars.outputs.USE_QEMU && 'linux/amd64,linux/arm64' || (contains(runner.arch, 'ARM') && 'linux/arm64' || 'linux/amd64') }}
          outputs: type=image,name=${{ needs.expose-vars.outputs.REGISTRY }}/${{ needs.expose-vars.outputs.NAMESPACE }}/${{ needs.expose-vars.outputs.IMAGE_NAME }},push-by-digest=true,name-canonical=true,push=true
          build-args: |
            APP_VERSION=${{ needs.expose-vars.outputs.TAG || needs.pre-build.outputs.short-sha }}
          # cache-from: type=gha
          # cache-to: type=gha,mode=max
          cache-from: type=local,src=/tmp/.buildx-cache
          cache-to: type=local,dest=/tmp/.buildx-cache-new

      # Necessary to avoid forever growing cache
      # https://github.com/docker/build-push-action/issues/252
      # https://github.com/moby/buildkit/issues/1896
      - name: Move cache
        run: |
          rm -rf /tmp/.buildx-cache
          mv /tmp/.buildx-cache-new /tmp/.buildx-cache

      - name: Export digest
        run: |
          mkdir -p /tmp/digests/${{ needs.expose-vars.outputs.IMAGE_NAME }}
          digest="${{ steps.build.outputs.digest }}"
          touch "/tmp/digests/${{ needs.expose-vars.outputs.IMAGE_NAME }}/${digest#sha256:}"

      - name: Upload digest
        uses: actions/upload-artifact@v3
        with:
          name: digests-${{ needs.expose-vars.outputs.IMAGE_NAME }}
          path: /tmp/digests/${{ needs.expose-vars.outputs.IMAGE_NAME }}/*
          if-no-files-found: error
          retention-days: 1

  post-build:
    name: Merge digest
    runs-on: ubuntu-latest
    needs:
      - expose-vars
      - pre-build
      - build
    steps:
      - name: Download digests
        uses: actions/download-artifact@v3
        with:
          name: digests-${{ needs.expose-vars.outputs.IMAGE_NAME }}
          path: /tmp/digests/${{ needs.expose-vars.outputs.IMAGE_NAME }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Docker meta
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ needs.expose-vars.outputs.REGISTRY }}/${{ needs.expose-vars.outputs.NAMESPACE }}/${{ needs.expose-vars.outputs.IMAGE_NAME }}
          tags: |
            type=raw,value=${{ needs.pre-build.outputs.lower-branch }},enable=${{ github.head_ref != 'main' }}
            type=raw,value=${{ needs.expose-vars.outputs.TAG }},enable=${{ needs.expose-vars.outputs.TAG != '' }}

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ needs.expose-vars.outputs.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
          logout: true

      - name: Create manifest list and push
        working-directory: /tmp/digests/${{ needs.expose-vars.outputs.IMAGE_NAME }}
        run: |
          docker buildx imagetools create $(jq -cr '.tags | map("-t " + .) | join(" ")' <<< "$DOCKER_METADATA_OUTPUT_JSON") \
            $(printf '${{ needs.expose-vars.outputs.REGISTRY }}/${{ needs.expose-vars.outputs.NAMESPACE }}/${{ needs.expose-vars.outputs.IMAGE_NAME }}@sha256:%s ' *)

      - name: Inspect image
        run: |
          docker buildx imagetools inspect ${{ needs.expose-vars.outputs.REGISTRY }}/${{ needs.expose-vars.outputs.NAMESPACE }}/${{ needs.expose-vars.outputs.IMAGE_NAME }}:${{ steps.meta.outputs.version }}

  e2e-tests:
    name: End to end tests
    runs-on: ubuntu-latest
    needs:
      - expose-vars
      - post-build
    strategy:
      matrix:
        browsers: ${{ needs.expose-vars.outputs.BROWSERS }}
    steps:
      - name: Checks-out repository
        uses: actions/checkout@v3

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        id: pnpm-install
        with:
          version: "${{ needs.expose-vars.outputs.PNPM_VERSION }}"
          run_install: false

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "${{ needs.expose-vars.outputs.NODE_VERSION }}"

      - name: Setup firefox
        uses: browser-actions/setup-firefox@v1
        if: ${{ matrix.browsers == 'firefox' }}

      - name: Setup chrome
        uses: browser-actions/setup-chrome@v1
        if: ${{ matrix.browsers == 'chrome' }}

      - name: Setup edge
        uses: browser-actions/setup-edge@v1
        if: ${{ matrix.browsers == 'edge' }}

      - name: Get pnpm store directory
        id: pnpm-store
        run: |
          echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT

      - name: Cache node files
        uses: actions/cache@v3
        with:
          path: |
            ${{ steps.pnpm-store.outputs.STORE_PATH }}
            /home/runner/.cache/Cypress
          key: node-${{ runner.os }}-${{ runner.arch }}-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            node-${{ runner.os }}-${{ runner.arch }}-

      - name: Cache turbo files
        uses: actions/cache@v3
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

      - name: Upload cypress artifacts
        if: ${{ failure() }}
        uses: actions/upload-artifact@v3
        with:
          name: cypress-report
          path: ./cypress/e2e/screenshots/
          retention-days: 14

  images-scan:
    name: Scan images vulnerabilities
    runs-on: ubuntu-latest
    needs:
      - expose-vars
      - post-build
    steps:
      - name: Set up Docker buildx
        uses: docker/setup-buildx-action@v2

      - name: Create security artifacts directory
        run: mkdir -p ./artifacts/vulnerability-report/images/

      - name: Run Trivy vulnerability scanner on images
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: "${{ needs.expose-vars.outputs.REGISTRY }}/${{ needs.expose-vars.outputs.NAMESPACE }}/${{ needs.expose-vars.outputs.IMAGE_NAME }}:${{ needs.expose-vars.outputs.TAG }}"
          format: "table"
          exit-code: "1"
          vuln-type: "os,library"
          ignore-unfixed: true
          output: "./artifacts/vulnerability-report/images/${{ needs.expose-vars.outputs.IMAGE_NAME }}.json"
        continue-on-error: true

      - name: Upload scan artifacts
        uses: actions/upload-artifact@v3
        with:
          name: vulnerability-report
          path: ./artifacts/vulnerability-report/
          retention-days: 14

  config-scan:
    name: Scan config files vulnerabilities
    runs-on: ubuntu-latest
    needs:
      - expose-vars
      - post-build
    steps:
      - name: Checks-out repository
        uses: actions/checkout@v3

      - name: Create security artifacts directory
        run: mkdir -p ./artifacts/vulnerability-report/configs/

      - name: Run Trivy vulnerability scanner on config files
        uses: aquasecurity/trivy-action@master
        with:
          scan-ref: "."
          scan-type: "config"
          format: "table"
          exit-code: "1"
          ignore-unfixed: true
          output: "./artifacts/vulnerability-report/configs/config.json"
        continue-on-error: true

      - name: Upload scan artifacts
        uses: actions/upload-artifact@v3
        with:
          name: vulnerability-report
          path: ./artifacts/vulnerability-report/
          retention-days: 14

  # Workaround for required status check in protection branches (see. https://github.com/orgs/community/discussions/13690)
  all-jobs-passed:
    name: Check jobs status
    runs-on: ubuntu-latest
    if: ${{ always() }}
    needs:
      - expose-vars
      - lint
      - unit-tests
      - component-tests
      - pre-build
      - build
      - post-build
      - e2e-tests
      - images-scan
      - config-scan
    steps:
      - name: Check status of all required jobs
        run: |-
          NEEDS_CONTEXT='${{ toJson(needs) }}'
          JOB_IDS=$(echo "$NEEDS_CONTEXT" | jq -r 'keys[]')
          for JOB_ID in $JOB_IDS; do
            RESULT=$(echo "$NEEDS_CONTEXT" | jq -r ".[\"$JOB_ID\"].result")
            echo "$JOB_ID job result: $RESULT"
            if [[ $RESULT != "success" && $RESULT != "skipped" ]]; then
              echo "***"
              echo "Error: The $JOB_ID job did not pass."
              exit 1
            fi
          done
          echo "All jobs passed or were skipped."
```

## Déploiement continue (CD)

```yaml
name: CD

on:
  push:
    branches:
      - main

env:
  REGISTRY: "ghcr.io"
  MULTI_ARCH: true
  USE_QEMU: false
  IMAGE_NAME: my-app

jobs:
  expose-vars:
    runs-on: ubuntu-latest
    outputs:
      REGISTRY: ${{ env.REGISTRY }}
      NAMESPACE: ${{ env.GITHUB_REPOSITORY_OWNER }}
      MULTI_ARCH: ${{ env.MULTI_ARCH }}
      USE_QEMU: ${{ env.USE_QEMU }}
      IMAGE_NAME: ${{ env.IMAGE_NAME }}
    steps:
      - name: Exposing env vars
        run: echo "Exposing env vars"

  release:
    name: Create new release
    runs-on: ubuntu-latest
    outputs:
      release-created: ${{ steps.release.outputs.release_created }}
      major-tag: ${{ steps.release.outputs.major }}
      minor-tag: ${{ steps.release.outputs.minor }}
      patch-tag: ${{ steps.release.outputs.patch }}
    steps:
      - name: Checks-out repository
        uses: actions/checkout@v3

      - name: Pre release new version
        uses: google-github-actions/release-please-action@v3
        id: release
        with:
          package-name: ${{ env.IMAGE_NAME }}
          release-type: node
          default-branch: main
          group-pull-request-title-pattern: release v${version}
          token: ${{ secrets.GITHUB_TOKEN }}

  build:
    name: Build application
    if: ${{ needs.release.outputs.release-created == 'true' }}
    runs-on: ${{ matrix.runners }}
    needs:
      - expose-vars
      - release
    strategy:
      matrix:
        runners: ${{ needs.expose-vars.outputs.MULTI_ARCH && !needs.expose-vars.outputs.USE_QEMU && fromJson('["ubuntu-latest", "ARM64"]') || fromJson('["ubuntu-latest"]') }}
    steps:
      - name: Checks-out repository
        uses: actions/checkout@v3

      - name: Set up Docker buildx
        uses: docker/setup-buildx-action@v2

      - name: Cache Docker layers
        uses: actions/cache@v3
        with:
          path: /tmp/.buildx-cache
          key: buildx-${{ runner.os }}-${{ runner.arch }}-${{ hashFiles('src/**') }}
          restore-keys: |
            buildx-${{ runner.os }}-${{ runner.arch }}-

      - name: Set up QEMU (for multi platform build)
        uses: docker/setup-qemu-action@v2
        if: ${{ needs.expose-vars.outputs.USE_QEMU }}

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ needs.expose-vars.outputs.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
          logout: true

      - name: Build and push docker image
        id: build
        uses: docker/build-push-action@v4
        with:
          context: ./
          file: ./Dockerfile
          provenance: false
          platforms: ${{ needs.expose-vars.outputs.MULTI_ARCH && needs.expose-vars.outputs.USE_QEMU && 'linux/amd64,linux/arm64' || (contains(runner.arch, 'ARM') && 'linux/arm64' || 'linux/amd64') }}
          outputs: type=image,name=${{ needs.expose-vars.outputs.REGISTRY }}/${{ needs.expose-vars.outputs.NAMESPACE }}/${{ needs.expose-vars.outputs.IMAGE_NAME }},push-by-digest=true,name-canonical=true,push=true
          # cache-from: type=gha
          # cache-to: type=gha,mode=max
          cache-from: type=local,src=/tmp/.buildx-cache
          cache-to: type=local,dest=/tmp/.buildx-cache-new

      # Necessary to avoid forever growing cache
      # https://github.com/docker/build-push-action/issues/252
      # https://github.com/moby/buildkit/issues/1896
      - name: Move cache
        run: |
          rm -rf /tmp/.buildx-cache
          mv /tmp/.buildx-cache-new /tmp/.buildx-cache

      - name: Export digest
        run: |
          mkdir -p /tmp/digests/${{ needs.expose-vars.outputs.IMAGE_NAME }}
          digest="${{ steps.build.outputs.digest }}"
          touch "/tmp/digests/${{ needs.expose-vars.outputs.IMAGE_NAME }}/${digest#sha256:}"

      - name: Upload digest
        uses: actions/upload-artifact@v3
        with:
          name: digests-${{ needs.expose-vars.outputs.IMAGE_NAME }}
          path: /tmp/digests/${{ needs.expose-vars.outputs.IMAGE_NAME }}/*
          if-no-files-found: error
          retention-days: 1

  post-build:
    name: Merge digest
    if: ${{ needs.release.outputs.release-created == 'true' }}
    runs-on: ubuntu-latest
    needs:
      - expose-vars
      - release
      - build
    steps:
      - name: Download digests
        uses: actions/download-artifact@v3
        with:
          name: digests-${{ needs.expose-vars.outputs.IMAGE_NAME }}
          path: /tmp/digests/${{ needs.expose-vars.outputs.IMAGE_NAME }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Docker meta
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ needs.expose-vars.outputs.REGISTRY }}/${{ needs.expose-vars.outputs.NAMESPACE }}/${{ needs.expose-vars.outputs.IMAGE_NAME }}
          tags: |
            type=raw,value=${{ needs.release.outputs.major-tag }}.${{ needs.release.outputs.minor-tag }}.${{ needs.release.outputs.patch-tag }}
            type=raw,value=latest,enable=${{ github.ref == format('refs/heads/{0}', 'main') }}

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ needs.expose-vars.outputs.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
          logout: true

      - name: Create manifest list and push
        working-directory: /tmp/digests/${{ needs.expose-vars.outputs.IMAGE_NAME }}
        run: |
          docker buildx imagetools create $(jq -cr '.tags | map("-t " + .) | join(" ")' <<< "$DOCKER_METADATA_OUTPUT_JSON") \
            $(printf '${{ needs.expose-vars.outputs.REGISTRY }}/${{ needs.expose-vars.outputs.NAMESPACE }}/${{ needs.expose-vars.outputs.IMAGE_NAME }}@sha256:%s ' *)

      - name: Inspect image
        run: |
          docker buildx imagetools inspect ${{ needs.expose-vars.outputs.REGISTRY }}/${{ needs.expose-vars.outputs.NAMESPACE }}/${{ needs.expose-vars.outputs.IMAGE_NAME }}:${{ steps.meta.outputs.version }}
```
