# Déploiement

## Cloud Pi Native

La plateforme de déploiement cible est [Cloud Pi Native](https://cloud-pi-native.fr), un PaaS open source interne basé sur Kubernetes. La [console Cloud Pi Native](https://github.com/cloud-pi-native/console) offre une surcouche simplifiée pour le déploiement vers des clusters Kubernetes et OpenShift.

Les équipes doivent orienter leurs projets **dès la création** vers :

- la **conteneurisation** de tous les services ;
- la **sécurité renforcée** avec un minimum de privilèges ;
- la compatibilité **Kubernetes** et **OpenShift**.

## Concevoir pour le conteneur dès le départ

### Images Docker optimisées

Les images Docker doivent être pensées pour la production et un environnement rootless :

- utiliser des images de base légères (`*-alpine`, `*-slim`, `distroless`) ;
- exécuter les processus avec un **utilisateur non-root** (UID ≥ 1000) ;
- utiliser un build **multi-stage** pour séparer les dépendances de build et de production ;
- ne pas embarquer de secrets, fichiers de développement ou outils inutiles ;
- écouter sur un **port non privilégié** (≥ 1024, ex. `8080`).

```dockerfile
# Exemple : image Node.js prête pour Kubernetes / rootless
FROM docker.io/node:24-alpine AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM docker.io/nginxinc/nginx-unprivileged:1.29-alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
USER 1001
```

### Bonnes pratiques de sécurité

- ne jamais utiliser l'image `latest` en production — toujours épingler un tag précis ;
- scanner les images avec [Trivy](https://github.com/aquasecurity/trivy) ou un outil équivalent dans la CI ;
- configurer un `securityContext` Kubernetes restrictif :

```yaml
securityContext:
  runAsNonRoot: true
  readOnlyRootFilesystem: true
  allowPrivilegeEscalation: false
  capabilities:
    drop: [ALL]
```

## Environnement de développement local

### Docker Compose

Pour le développement quotidien, **Docker Compose** est suffisant et reste l'outil le plus simple pour orchestrer plusieurs services localement.

### Kubernetes local (optionnel)

Pour reproduire un environnement plus proche de la production, les outils suivants peuvent être utilisés :

| Outil                                     | Description                                                           |
| ----------------------------------------- | --------------------------------------------------------------------- |
| [Kind](https://kind.sigs.k8s.io/)         | Kubernetes in Docker — clusters Kubernetes dans des conteneurs Docker |
| [k3d](https://k3d.io/)                    | Wrapper autour de k3s dans Docker, léger et rapide                    |
| [Minikube](https://minikube.sigs.k8s.io/) | Cluster Kubernetes local, supporte plusieurs drivers                  |

::: tip
Un cluster Kind/k3d en local permet de tester les manifestes Kubernetes et les Helm charts avant de pousser en CI, mais Docker Compose reste le choix par défaut pour le développement.
:::

## Helm charts

Le déploiement vers Kubernetes doit être **systématiquement fait via des Helm charts**. Les manifestes Kubernetes bruts (fichiers YAML statiques) sont à éviter.

### Pourquoi Helm ?

- **Paramétrage** — les `values.yaml` permettent d'adapter le déploiement à chaque environnement (dev, staging, prod) sans dupliquer les manifestes ;
- **Reproductibilité** — un chart versionné garantit des déploiements identiques ;
- **Rollback** — retour à une version précédente en une commande ;
- **Écosystème** — compatible nativement avec Cloud Pi Native, ArgoCD, FluxCD.

### Template de référence

Un template Helm complet et prêt à l'emploi est disponible :

::: info Gabarit Helm
[**this-is-tobi/helm-charts/template**](https://github.com/this-is-tobi/helm-charts/tree/main/template) — template Helm générique couvrant les ressources courantes (Deployment, Service, Ingress, HPA, ConfigMap, Secret, ServiceAccount…).
:::

### Structure minimale attendue

```
helm/
├── Chart.yaml            # Métadonnées du chart (nom, version, appVersion)
├── values.yaml            # Valeurs par défaut
├── templates/
│   ├── _helpers.tpl       # Fonctions et labels réutilisables
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   ├── hpa.yaml
│   └── serviceaccount.yaml
└── values/                # (optionnel) fichiers de values par environnement
    ├── dev.yaml
    ├── staging.yaml
    └── prod.yaml
```

### Bonnes pratiques Helm

- utiliser les labels standards Kubernetes (`app.kubernetes.io/name`, `app.kubernetes.io/version`, etc.) via `_helpers.tpl` ;
- rendre les ressources optionnelles avec des conditions (<code v-pre>&#123;&#123;- if .Values.ingress.enabled &#125;&#125;</code>) ;
- ne jamais mettre de secrets en clair dans `values.yaml` — utiliser des Sealed Secrets ou un gestionnaire de secrets externe ;
- versionner le chart indépendamment de l'application (`version` ≠ `appVersion` dans `Chart.yaml`) ;
- valider les charts en CI avec `helm lint` et `helm template`.
