# Installation d’une machine de dev Ubuntu

## Ce que l’on va installer

- Git
- zsh
- oh-my-zsh
- Volta et node
- GitHub CLI
- pnpm
- docker

## [Git](https://git-scm.com/)

Dans un terminal WSL :

```shell
sudo apt update
sudo apt install git
```

## ZSH

<!--@include: ./parts/zsh-oh-my-zsh.md-->

## Polices d’écriture

<!--@include: ./parts/fonts.md-->

## Volta

<!--@include: ./parts/volta.md-->

## GitHub CLI

<!--@include: ./parts/github-cli-posix.md-->

## pnpm

[`pnpm`](https://pnpm.io/) est le gestionnaire de paquets du registre npm qu’il est recommandé d’utiliser.

<!--@include: ./parts/pnpm-posix.md-->

Plus d’informations : <https://pnpm.io/installation>

## Docker desktop

<!--@include: ./parts/docker-posix.md-->
