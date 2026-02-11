# Installation d’une machine de dev Ubuntu

## Ce que l’on va installer

- Git
- zsh
- oh-my-zsh
- proto et node
- GitHub CLI
- pnpm
- docker

## [Git](https://git-scm.com/)

Dans un terminal :

```shell
sudo apt update
sudo apt install git
```

<!--@include: ./parts/git-config.md -->

## ZSH

<!--@include: ./parts/zsh-oh-my-zsh.md-->

## Polices d’écriture

<!--@include: ./parts/fonts.md-->

## proto

<!--@include: ./parts/proto.md-->

## GitHub CLI

<!--@include: ./parts/github-cli-posix.md-->

## pnpm

[`pnpm`](https://pnpm.io/) est le gestionnaire de paquets du registre npm qu’il est recommandé d’utiliser.

<!--@include: ./parts/pnpm-posix.md-->

Plus d’informations : <https://pnpm.io/installation>

## Docker desktop

<!--@include: ./parts/docker-posix.md-->
