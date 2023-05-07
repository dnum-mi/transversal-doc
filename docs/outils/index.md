# Les outils du développeur JavaScript/TypeScript

## Docker

Des images Docker sont utilisées en prod pour chaque application, il est donc indispensable d’avoir Docker pour tester le build des images (et le run des containers) qui seront livrées.

## Node.js

[Node.js](https://nodejs.org/) est l’environment d’exécution JavaScript utilisé. Il faut donc l’avoir installé.

L’interpréteur de commande `npm` est livré avec Node.js, cependant c’est `pnpm` qu’il est recommandé d’utiliser (notamment pour sa gestion d’espace disque).

La version de Node.js qui doit être utilisée est la dernière LTS (`18.16.0` à l’heure où ce document est écritique).

Pour rappel, tous les 6 mois sort une version, et tous les ans en octobre la [version majeure à nombre paire devient la nouvelle LTS](https://github.com/nodejs/release#release-schedule).

## pnpm

[`pnpm`](https://pnpm.io/) est le gestionnaire de paquets du registre npm qu’il est recommandé d’utiliser.

Sur Windows, avec powershell :

```
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

Sur système POSIX,

Avec cURL :

```
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

Avec wget :

```
wget -qO- https://get.pnpm.io/install.sh | sh -
```

## Volta

Afin de ne pas se préoccuper de la version de Node.js à utiliser pour chaque projet, il est recommandé de fixer la version avec Volta dans le `package.json` de chaque projet et d’utiliser Volta pour utiliser la bonne version.

### Installation de Volta

Sur Windows :

Télécharger et lancer [l’installateur](https://github.com/volta-cli/volta/releases/download/v1.1.1/volta-1.1.1-windows-x86_64.msi)

Sur système POSIX :

```
curl https://get.volta.sh | bash
```

## REST Client
