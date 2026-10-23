# transversal-doc — CoFabNum

Documentation transversale des projets de la **Fabrique Numérique** (DNUM/MI), regroupant les conventions, bonnes pratiques et guides techniques partagés entre les équipes de développement.

Le site est généré avec [VitePress](https://vitepress.dev) et accessible en interne.

## Objectif

Ce dépôt centralise les référentiels communs aux projets de la Fabrique Numérique :

- **Conventions** – nommage, architecture des dossiers, TypeScript, API RESTful, lint et formattage.
- **Stack technique** – bibliothèques et outils recommandés (ESLint, Prettier, Prisma, Vitest, Playwright, etc.).
- **Recettes** – guides de démarrage pour Vue 3, Nuxt 3, NestJS, Fastify et FastAPI.
- **Environnement de travail** – installation et configuration de la machine de développement (Windows, macOS, Ubuntu).
- **Monorepo** – configuration pnpm workspaces et Turborepo.
- **CI/CD** – principes et exemples de pipelines GitHub Actions.

## Démarrage rapide

> Prérequis : [Node.js](https://nodejs.org) et [pnpm](https://pnpm.io)

```bash
# Installer les dépendances
pnpm install

# Lancer le serveur de développement (http://localhost:5172)
pnpm dev

# Générer le site statique
pnpm build

# Prévisualiser le build
pnpm preview
```

## Docker

```bash
# Construire l'image
pnpm docker:build

# Lancer le conteneur (http://localhost:8080)
pnpm docker:run
```

## Déploiement

La CI/CD s'appuie sur les [workflows réutilisables](https://github.com/dnum-mi/fabnum-cicd) de la Fabrique Numérique. Chaque commit conventionnel fusionné sur `main` alimente une pull request de release ([release-please](https://github.com/googleapis/release-please)). Quand celle-ci est fusionnée, la CI :

1. crée le tag et la release GitHub `vX.Y.Z` ;
2. construit l'image `ghcr.io/dnum-mi/transversal-doc:X.Y.Z` (et `latest`) pour `amd64` et `arm64` ;
3. publie le chart Helm sur le registre OCI `oci://ghcr.io/dnum-mi/transversal-doc/transversal-doc`, avec la même version `X.Y.Z` pour le chart et l'application.

ArgoCD suit les versions du chart, aucun appel de synchronisation n'est nécessaire. L'image déployée est celle de l'`appVersion` du chart :

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: transversal-doc
  namespace: argocd
spec:
  project: default
  source:
    repoURL: ghcr.io/dnum-mi/transversal-doc # sans le préfixe oci://
    chart: transversal-doc
    targetRevision: "0.*" # dernière version 0.x.y du chart
  destination:
    server: https://kubernetes.default.svc
    namespace: transversal-doc
  syncPolicy:
    automated: {}
```

Le registre doit être déclaré dans ArgoCD comme dépôt Helm OCI (`enableOCI`).

### Versions

Les versions restent en `0.x` : un `feat` ou un changement cassant incrémente la version mineure, tout le reste (`fix`, `docs`, `refactor`...) la version de patch. Le passage en `1.0.0` est manuel, avec un commit portant le pied de page `Release-As` :

```bash
git commit --allow-empty -m "chore: release 1.0.0" -m "Release-As: 1.0.0"
```

La release suivante est alors `1.0.0`, et release-please applique ensuite les règles habituelles (un changement cassant incrémente la version majeure). `targetRevision: "0.*"` ne suit pas les versions `1.x` : changer la valeur de ce champ en `"1.*"` fait partie de la bascule.

> [!IMPORTANT]
> - La pull request de release est ouverte avec le `GITHUB_TOKEN` (le paramètre « Allow GitHub Actions to create and approve pull requests » doit rester activé) : la CI ne s'exécute donc pas dessus. Pour qu'elle s'exécute, fournir une GitHub App (secrets `APP_CLIENT_ID` et `APP_PRIVATE_KEY`) ou un `GH_PAT`, voir [l'authentification des workflows](https://github.com/dnum-mi/fabnum-cicd/blob/main/docs/workflows/05-authentication.md).
> - Après la première publication, passer le package GHCR du chart en public (ou fournir des identifiants à ArgoCD).

## Structure

```
docs/          # Sources de la documentation (Markdown + VitePress)
helm/          # Chart Helm pour le déploiement Kubernetes
ci/            # Configuration de chart-testing pour la CI
scripts/       # Scripts de build (hashes CSP des scripts inline)
Dockerfile     # Image de production (nginx)
nginx.conf     # Configuration nginx (headers de sécurité inclus)
```

## Contribuer

Toute contribution est la bienvenue. Pour proposer une modification, ouvrez une pull request en suivant les [conventions de contribution](/docs/conventions/index.md) décrites dans la documentation elle-même.
