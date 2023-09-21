### Noms de branche git

#### Le nom de la branche par défaut devrait être `main`

Pour changer le nom de la branche par défaut pour tous les prochains projets créés avec `git init` :

```shell
git config --global init.defaultBranch main
```

Ceci va ajouter cette ligne dans votre `~/.gitconfig` :

```toml
[init]
    defaultBranch = main
```

#### Le nom des autres branches

Le nom de branche doit être formé de la façon suivante :

`<feat|fix|hotfix|tech|docs|refacto>/<description-en-kebab-case>#<ticket_github>`

- `feat` pour une nouvelle fonctionnalité
- `fix` pour une correction d’anomalie ou correction de graphie
- `hotfix` pour une correction d’anomalie qui est déjà en prod
- `tech` pour une amélioration technique (réduction de dette technique, changement de nom de table ou champ, amélioration de script de build ou de  déploiement...)
- `docs` pour une modification de la documentation
- `refacto` pour un remaniement du code (qui n’ajoute pas de fonctionnalité pour l’utilisateur)

Exemples :

- `feat/worker-logs#353`
- `refacto/reorganize-backend#360`

### Message de validation (*commit*)

Les messages de validation *git* doivent respecter les conventions de [Commits Conventionnels](https://www.conventionalcommits.org/fr/v1.0.0/).

Cela permet de facilement connaître le contenu d’un commit que l’on cherche (résolution d’un bug, nouvelle fonctionnalité, CI/CD, configuration...) d’une part, et d’autre part permet de pouvoir générer facilement des Changelogs automatiquement.

le projet étant franco-français d’une part, et l’anglais n’étant que rarement maîtrisé d’autre part, les messages de commit peuvent être en français. S’ils sont en anglais, veuillez bien vérifier le vocabulaire (faux-amis, notamment) et la syntaxe, pour éviter les ambiguïtés.

### Noms de dossiers et fichiers

Les **noms des dossiers et des fichiers** doivent impérativement être écrits en [**kebab-case**](https://www.freecodecamp.org/news/snake-case-vs-camel-case-vs-pascal-case-vs-kebab-case-whats-the-difference/) avec une seule exception : les noms de dossiers et de fichiers de composants Vue et des fichiers s’y afférents (fichiers de tests unitaires et de tests end-to-end, par exemple).

Les noms de **composants Vue** doivent impérativement être formés d’**au moins 2 mots**, avec une seule exception : le composant `App.vue`

Exemple d’une application Vue :

```console
.
├── README.md
├── env.d.ts
├── index.html
├── package.json
├── public
│   ├── browserconfig.xml
│   ├── favicon.ico
│   ├── icons
│   │   ├── android-icon-144x144.png
│   │   ├── ...
│   │   └── ms-icon-70x70.png
│   ├── manifest.json
│   └── marianne-icon.png
├── src
│   ├── App.vue
│   ├── components
│   │   ├── BadgeTypeOrganisme.vue
│   │   ├── BiblioNumDataTable.cy.ts
│   │   ├── BiblioNumDataTable.vue
│   ├── stores
│   │   ├── index.ts
│   │   ├── role.ts
│   │   └── user.ts
│   └── utils
│       ├── __tests__
│       │   └── fake-data.ts
│       ├── api-client.ts
│       └── demarche-mapping.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.vite-config.json
├── tsconfig.vitest.json
├── vite.config.ts
└── vitest-setup.ts
```

### Noms de variables

- variable contenant une valeur booléenne : doit commencer par `is` (rarement `has`, `should` ou `can`) et être en `camelCase`  (comme `isReallyTrue`)
- variable contenant une date : doit être suffixée par `Date` ou `At` et être en `camelCase`  comme `startDate` ou `lastModifiedAt`
- fonction constructeur et classe : `PascalCase`
- autre variable ou fonction : `camelCase`
- constante : `SCREAMING_SNAKE_CASE`

Les noms de variables et de fonctions (méthodes aussi) doivent être explicite, et donc potentiellement très long... Jusqu’à une certaine limite.

Les noms de variable d’un seul caractère doivent être proscrits, sauf dans de (très très) rares cas, comme la fonction d’identité (`x => x`) ou des fonctions fléchées extrêmement simples.

Les **noms de variable doivent être au maximum en anglais**, et **peuvent être en français dans certains cas** si la traduction prête à confusion ou trop difficile (`demarche` ou `dossier`) ou si c’est un mot réservé (`affaire` peut rester `affaire` pour ne pas utiliser `case`).
