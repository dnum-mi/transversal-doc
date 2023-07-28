#### Enregistrement du dépôt

Mettre à jour l’index des packages **apt** pour permettre à **apt** d’utiliser un dépôt en HTTPS :

```shell
sudo apt-get update

sudo apt-get install ca-certificates curl gnupg
```

#### Ajouter la clé officielle Docker

```shell
sudo install -m 0755 -d /etc/apt/keyrings

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

#### Installer le dépôt

```shell
 echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

> Note :
> Si vous utilisez une distro dérivée de Ubuntu, comme Linux Mint, vous aurez sans doute besoin d’utiliser `UBUNTU_CODENAME` au lieu de `VERSION_CODENAME`.

#### Installer le Docker Engine

Mettre à jour l’index des packages apt :

```shell
sudo apt-get update
```

Installer Docker Engine, containerd, et Docker Compose.

```shell
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Vérifier que docker fonctionne en lançant l’image hello-world

```shell
sudo docker run hello-world
```

Vous devriez voir s’afficher le texte suivant :

```shell
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
70f5ac315c5a: Pull complete
Digest: sha256:926fac19d22aa2d60f1a276b66a20eb765fbeea2db5dbdaafeb456ad8ce81598
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (arm64v8)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

Plus d’info : <https://docs.docker.com/engine/install/ubuntu/>

#### Étapes de post-installation

Il faut maintenant faire en sorte de pouvoir utiliser docker sans utiliser sudo.

#### Créer le groupe docker

Créer le groupe docker :

```shell
 sudo groupadd docker
```

Ajouter votre utilisateur au groupe docker :

```shell
sudo usermod -aG docker $USER
```

Quitter la session et rouvrez une nouvelle session pour que votre appartenance au groupe soit prise en compte, ou bien lancez la commande suivante :

```shell
newgrp docker
```

Vérifier que vous pouvez lancer la commande sans `sudo` :

```shell
docker run hello-world
```

Si vous avez utilisé la CLI Docker avec la commande sudo précédemment, vous verrez peut-être l’erreur suivante :

```shell
WARNING: Error loading config file: /home/user/.docker/config.json -
stat /home/user/.docker/config.json: permission denied
```

Cette erreur indique que les paramètres de permission pour le dossier `~/.docker/`  sont incorrects, parce que la commande a été utilisée avec sudo précédemment.

Pour corriger le problème, soit supprimez le dossier `~/.docker/` (il sera recréé automatiquement), ou bien changez les droits sur le dossier :

```shell
sudo chown "$USER":"$USER" /home/"$USER"/.docker -R

sudo chmod g+rwx "$HOME/.docker" -R
```

Plus d’info : <https://docs.docker.com/engine/install/linux-postinstall/>
