# Construire un projet Vue 3 pour le MI

Le ministère de l’intérieur doit suivre le [système de design français (DSFR)](https://www.systeme-de-design.gouv.fr/), et la Fabrique Numérique a choisi Vue pour ses projets Front.

Il existe un [portage du DSFR pour Vue](https://vue-dsfr.netlify.app/) qui est activement mis à jour par Stanislas Ormières et par l’équipe du BRR.

## `create-vue-dsfr`

Le plus simple est d’utiliser la CLI créé et maintenu par Stanislas Ormières `create-vue-dsfr` :

```console
npm init vue-dsfr
```

Et suivre les indications en répondant `Vue 3` et `TS`.

## Ce que contient un projet créé avec `create-vue-dsfr`

Le projet généré contient tout ce qu’il faut pour commencer à travailler :

- une configuration pour TypeScript
- une configuration pour ESlint
- les dépendances nécessaires pour utiliser VueDsfr
- une application d’exemple avec un en-tête
- un router minimal avec deux routes intégré à l’application
- un store minimal intégré à l’application
- les plugins [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import) et [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components)

## Ce qu’on peut rajouter

- [date-fns](https://date-fns.org/) si le projet manipule et/ou affiche des dates
