[proto](https://moonrepo.dev/docs/proto) est un gestionnaire de toolchain unifié et pluggable. Il permet d'installer et d'utiliser la bonne version de node (et d'autres outils) par projet, sans installation globale. Plusieurs versions peuvent cohabiter.

Cet outil remplace avantageusement `nvm`, `n` ou `volta` : il détecte automatiquement la version à utiliser en parcourant les fichiers `.prototools` du répertoire courant et de ses parents.

### Installer proto

```shell
bash <(curl -fsSL https://moonrepo.dev/install/proto.sh)
```

::: tip Windows (PowerShell)

```powershell
irm https://moonrepo.dev/install/proto.ps1 | iex
```

:::

### Utiliser proto

Une fois proto installé, pour fixer la version de Node.js à utiliser pour le projet, il faut lancer la commande suivante à la racine du projet :

```shell
proto pin node lts
```

Cette commande créera (ou mettra à jour) un fichier `.prototools` avec la version épinglée (vérifier la dernière version LTS sur [nodejs.org](https://nodejs.org)) :

```toml
[tools]
node = "24.13.1"
```

On peut également épingler pnpm :

```shell
proto pin pnpm latest
```

Pour installer les versions épinglées :

```shell
proto install
```

Ensuite, pour n'importe quel utilisateur qui a proto installé, dès qu'il se trouvera dans ce répertoire ou un de ses sous-répertoires, proto se chargera d'utiliser la version fixée dans le fichier `.prototools`.

Idéalement, il faut fixer la même version pour l'image Docker utilisée par les scripts CI que celle qui est fixée avec proto.

::: info CI/CD
Pour utiliser proto dans une GitHub Action, on peut utiliser l'action officielle :

```yaml
- uses: moonrepo/setup-toolchain@v0
  with:
    auto-install: true
```

:::
