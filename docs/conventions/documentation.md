# La documentation des projets

La documentation d’un projet est très importante pour deux populations très distinctes : les utilisateurs de l’application, et les développeurs de l’application.

::: tip
Les deux documentations essentielles

Chaque projet doit avoir 2 documentations, distinctes et mises à jour régulièrement :

- une pour les utilisateurs
- une pour les développeurs
:::

::: tip
La documentation pour le déploiement

Éventuellement une troisième documentation peut être présente pour ceux qui seront en charge du déploiement. Idéalement, elle devrait être simple et peut être contenu dans la documentation destinée aux développeurs.
:::

## La documentation pour les développeurs

Elle doit contenir :

- une liste des prérequis (OS et leurs versions, logiciels et leurs versions à avoir pour travailler sur le projet)
- la stack détaillée du projet
- un TL;DR avec comment lancer les tests, comment démarrer l’application
- une partie pour les nouveaux arrivants sur le projet (très important)
- les conventions à suivre pour ce projet (avec un rappel vers la présente documentation)

### Le fichier `README.md`

Le `README.md` est le premier fichier lu par un nouveau développeur. Il doit contenir au minimum :

```markdown
# Nom du projet

> Description courte du projet

## Prérequis

- Node.js 24.x (via proto)
- pnpm 10.x
- Docker

## Démarrage rapide

pnpm install
pnpm dev

## Scripts disponibles

| Commande     | Description                  |
| ------------ | ---------------------------- |
| `pnpm dev`   | Lancer en mode développement |
| `pnpm build` | Compiler le projet           |
| `pnpm test`  | Lancer les tests             |
| `pnpm lint`  | Vérifier le lint             |

## Architecture

Voir [conventions d'architecture](/conventions/architecture-dossiers).
```

### Le fichier `CONTRIBUTING.md`

Pour les projets avec des contributeurs externes, un fichier `CONTRIBUTING.md` décrivant le workflow de contribution (branching, PR, revues) est recommandé.

## La documentation pour les utilisateurs

Cette documentation, la plupart du temps, s'adresse à un public non-technique. Veillez à prendre cela en compte en rédigeant la documentation.

Elle doit contenir :

- un guide de démarrage pas-à-pas
- les fonctionnalités principales avec captures d'écran ou GIFs
- une FAQ pour les questions récurrentes
- les coordonnées de contact en cas de problème
