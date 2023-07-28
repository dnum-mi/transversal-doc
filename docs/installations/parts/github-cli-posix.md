La [CLI GitHub](https://cli.github.com/) permet de faciliter les interactions avec GitHub depuis le shell.

Installation pour Ubuntu et debian-based :

```shell
type -p curl >/dev/null || (sudo apt update && sudo apt install curl -y)
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
&& sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
&& echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
&& sudo apt update \
&& sudo apt install gh -y
```

Mise à jour :

```shell
sudo apt update
sudo apt install gh
```

Autres distributions :
<https://github.com/cli/cli/blob/trunk/docs/install_linux.md>

<!--@include: ./github-cli-examples.md-->
