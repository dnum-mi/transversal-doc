Volta permet d’utiliser la bonne version de node par projet, sans installer node en global. Plusieurs versions de node peuvent cohabiter.

Cet outil est similaire à `nvm` ou `n`, cependant il est disponible sur tous les OS et est plus simple d’utilisation : pas besoin d’utiliser une commande pour utiliser la bonne version de node.

### Installer Volta

```shell
# install Volta
curl https://get.volta.sh | bash

# install Node
volta install node

# start using Node
node
```

Rajouter les lignes suivantes à `~/.zshrc` :

```shell
export VOLTA_HOME="$HOME/.volta"
export PATH="$VOLTA_HOME/bin:$PATH"
```

Idéalement, il faut fixer la même version pour l’image Docker utilisée par les scripts CI que celle qui est fixée avec Volta.

###  Utiliser Volta

Une fois Volta installé, pour fixer la version de Node.js à utiliser pour le projet, il faut lancer la commande suivante dans le dossier où est présent le fichier `package.json` du projet :

```shell
volta pin node@lts
```

Cette commande fixera la version de Node.js du projet avec la denrière LTS (à l’heure de l’écriture de ce document, la version `18.16.0`), et rajoutera les lignes suivantes dans le fichier `package.json` :

```json
"volta": {
  "node": "18.16.0"
}
```

Ensuite, pour n’importe quel utilisateur qui a Volta installé, dès qu’il se trouvera dans ce répertoire ou un de ses sous-répertoires, Volta se chargera d’utiliser la version fixée dans le `package.json`.
