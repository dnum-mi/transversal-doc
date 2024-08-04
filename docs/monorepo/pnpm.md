# [`pnpm`](https://pnpm.io)

`pnpm` est un gestionnaire de paquets (*packages*) qui utilise le registre (*registry*) [`npm`](https://npmjs.com) et qui

- est plus rapide ;
- réduit l’espace utilisé par les dossiers `node_modules` ;
- possède un support pour les monorepo (npm aussi, historiquement bien après `pnpm` et `yarn`).

## Utiliser pnpm pour un monorepo

### Créer un fichier `pnpm-workspace.yaml`

Le fichier `pnpm-workspace.yaml` contiendra quelque chose comme ceci :

```yml
packages:
  - "packages/**"
  - "apps/**"
```

Cela indique à `pnpm` que les workspaces sont dans les sous-dossiers de `packages` et `apps`.

Par conventions, on mettra les applications dans `apps` et les paquets partagés dans `packages`.

Voici un exemple d’arborescence simplifiée :

```txt
.
├── apps
│   ├── client
│   │   └── package.json
│   └── server
│       └── package.json
├── package.json
├── packages
│   ├── eslint-config-fabnum
│   │   └── package.json
│   ├── shared
│   │   └── package.json
│   └── tsconfig
│       ├── package.json
│       └── tsconfig.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

Chaque application (`client` et `server`) et chaque paquet (`eslint-config-fabnum`, `shared`, tsconfig) aura son `package.json` et il n’y aura qu’un fichier de verrouillage des versions des dépendances, à la racine (ici `pnpm-lock.yaml`).

Dans le package.json d’un paquet partagé, le nom est important, et il est fortement recommandé de le scoper (préfixer le nom par `@<quelque chose>/`, par exemple `@console/shared`).

Dans les exemples suivants, le scope de l’application sera `@dummy` :

```txt
.
├── apps
│   ├── client
│   │   └── package.json (contient "name": "@dummy/client" ou "@dummy/front")
│   └── server
│       └── package.json (contient "name": "@dummy/server" ou "@dummy/api")
├── package.json
├── packages
│   ├── eslint-config-fabnum
│   │   └── package.json (contient "name": "@dummy/eslint-config-fabnum")
│   ├── shared
│   │   └── package.json (contient "name": "@dummy/shared")
│   └── tsconfig
│       ├── package.json (contient "name": "@dummy/tsconfig")
│       └── tsconfig.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

et ces noms seront utilisés dans `"dependencies"` et `"devDependencies"` comme suit :

```json
{
  ...
  "dependencies": {
    "@dummy/shared": "workspace:^"
    ...
  },
  "devDependencies": {
    "@dummy/eslint-config-fabnum": "workspace:^",
    "@dummy/tsconfig": "workspace:^",
    ...
  }
  ...
}
```
