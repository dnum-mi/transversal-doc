# Les recettes pour Vue 3

## Construire un projet Nuxt 3 pour le MI

Le ministère de l’intérieur doit suivre le [système de design français (DSFR)](https://www.systeme-de-design.gouv.fr/), et la Fabrique Numérique a choisi Vue pour ses projets Front.

Il existe un [portage du DSFR pour Vue](https://vue-dsfr.netlify.app/) qui est activement mis à jour par Stanislas Ormières et par l’équipe du BRR et qui est compatible Nuxt 3.

### `create-vue-dsfr`

Le plus simple est d’utiliser la CLI créé et maintenu par Stanislas Ormières `create-vue-dsfr` :

```console
npm init vue-dsfr
```

Et suivre les indications en répondant `Nuxt 3` et `TS`.

### Ce que contient un projet créé avec `create-vue-dsfr`

Le projet généré contient tout ce qu’il faut pour commencer à travailler :

- une configuration pour TypeScript
- une configuration pour ESlint
- les dépendances nécessaires pour utiliser VueDsfr
- une application d’exemple avec un en-tête
- un store minimal intégré à l’application
