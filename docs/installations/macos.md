# Installation d’une machine de dev macOS

## Ce que l’on va installer

- homebrew
- Git
- zsh
- oh-my-zsh
- Volta et node
- GitHub CLI
- pnpm
- docker

## homebrew

Lancer la commande suivante dans un terminal :

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Plus d’info : <https://brew.sh/>

## Git

Télécharger et installer Git : <https://git-scm.com/download/mac>

## ZSH

<!--@include: ./parts/zsh-oh-my-zsh.md-->

## Polices d’écriture

<!--@include: ./parts/fonts.md-->

## Volta

<!--@include: ./parts/volta.md-->

## GitHub CLI

```shell
brew install gh
```

## pnpm

[`pnpm`](https://pnpm.io/) est le gestionnaire de paquets du registre npm qu’il est recommandé d’utiliser.

<!--@include: ./parts/pnpm-macos.md-->

Plus d’informations : <https://pnpm.io/installation>

## Docker

Télécharger et installer [docker](https://www.docker.com/)
