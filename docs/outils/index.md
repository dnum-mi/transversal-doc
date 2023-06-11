# Les outils du développeur JavaScript/TypeScript

## Docker

Des images Docker sont utilisées en prod pour chaque application, il est donc indispensable d’avoir Docker pour tester le build des images (et le run des containers) qui seront livrées.

Sur Windows :

Suivre la [documentation officielle](https://docs.docker.com/desktop/install/windows-install/)

Sur macOS :

Suivre la [documentation officielle](https://docs.docker.com/desktop/install/mac-install/)

Sur Ubuntu :

Suivre la [documentation officielle](https://docs.docker.com/engine/install/ubuntu/)

**N.B. :**

Bien faire les étapes de [post-installation comme indiquées ici](https://docs.docker.com/engine/install/linux-postinstall/), notamment pour pouvoir utiliser `docker` sans devoir utiliser l’utilisateur `root` et éventuellement le lancer en tant que service au démarrage de l’ordinateur

## Node.js

[Node.js](https://nodejs.org/) est l’environment d’exécution JavaScript utilisé. Il faut donc l’avoir installé.

L’interpréteur de commande `npm` est livré avec Node.js, cependant c’est `pnpm` qu’il est recommandé d’utiliser (notamment pour sa gestion d’espace disque).

La version de Node.js qui doit être utilisée est la dernière LTS (`18.16.0` à l’heure où ce document est écritique).

Pour rappel, tous les 6 mois sort une version, et tous les ans en octobre la [version majeure à nombre paire devient la nouvelle LTS](https://github.com/nodejs/release#release-schedule).

## pnpm

[`pnpm`](https://pnpm.io/) est le gestionnaire de paquets du registre npm qu’il est recommandé d’utiliser.

Sur Windows, avec powershell :

```console
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

Sur système POSIX,

Avec cURL :

```console
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

Avec wget :

```console
wget -qO- https://get.pnpm.io/install.sh | sh -
```

## Volta

Afin de ne pas se préoccuper de la version de Node.js à utiliser pour chaque projet, il est recommandé de fixer la version avec Volta dans le `package.json` de chaque projet et d’utiliser Volta pour utiliser la bonne version.

### Installation de Volta

Sur Windows :

Télécharger et lancer [l’installateur](https://github.com/volta-cli/volta/releases/download/v1.1.1/volta-1.1.1-windows-x86_64.msi)

Sur système POSIX :

```console
curl https://get.volta.sh | bash
```

Idéalement, il faut fixer la même version pour l’image Docker utilisée par les scripts CI que celle qui est fixée avec Volta.

###  Utilisation de Volta

Une fois Volta installé, pour fixer la version de Node.js à utiliser pour le projet, il faut lancer la commande suivante dans le dossier où est présent le fichier `package.json` du projet :

```console
volta pin node@lts
```

Cette commande fixera la version de Node.js du projet avec la denrière LTS (à l’heure de l’écriture de ce document, la version `18.16.0`), et rajoutera les lignes suivante dans le fichier `package.json` :

```json
  "volta": {
    "node": "18.16.0"
  }
```

Ensuite, pour n’importe quel utilisateur qui a Volta installé, dès qu’il se trouvera dans ce répertoire ou un de ses sous-répertoires, Volta se chargera d’utiliser la version fixé dans le `package.json`.

### pnpm avec Volta

TODO: write

## Les fichiers `.rest`

Les fichiers `.rest` sont des fichiers qui permettent de facilement tester des API.

Voici un exemple :

```
@protocol = http
@host = localhost
@port = 3000
@apiPrefix = /api/v1
@baseUrl = {{protocol}}://{{host}}:{{port}}{{apiPrefix}}

###

{{baseUrl}}/version


###
# @name login
POST {{baseUrl}}/auth/token HTTP/1.1
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": ""53CR37P455!"
}

###
POST {{baseUrl}}/docs HTTP/1.1
Content-Type: application/json
Authorization: Bearer {{login.response.body.token}}

{
  "title": "Conventions",
  "description": "Ensemble des conventions (fortement) recommandées pour les projets de la Fabrique Numérique",
  "tags": ["conventions", "javascript", "typescript"],
  "content": "Lorem ipsum dolor sit amet, consectetur"
}

###
PATCH  {{baseUrl}}/docs/1 HTTP/1.1
Content-Type: application/json
Authorization: Bearer {{login.response.body.token}}

{
  "tags": ["conventions", "javascript", "typescript", "dossiers"],
}

###
DELETE  {{baseUrl}}/docs/1 HTTP/1.1
Authorization: Bearer {{login.response.body.token}}
```

[REST CLient](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) est une extension pour Visual Studio Code qui permet de (très) facilement tester des requêtes d’API RESTful.

Cf. [la page dédiée](./rest-client)

Pour JetBrains, regardez [cette page](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html)

## Editorconfig

Editorconfig est un logiciel soit inclus dans les éditeurs (JetBrains), soit disponible sous forme d’extension (VSCode).

Voici la configuration recommandée (dans le fichier `.editorconfig` à la racine du projet) :

```ini
# EditorConfig is awesome: https://EditorConfig.org

# top-most EditorConfig file
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

```

##  ESLint

Linter pour le JS et le TS.

Cf. [la page dédiée](./eslint)
