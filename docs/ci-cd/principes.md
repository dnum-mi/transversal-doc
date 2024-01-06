# Les principes de la CI/CD

L'approche CI/CD permet d'augmenter la fréquence de distribution des applications grâce à l'introduction de l'automatisation au niveau des étapes de développement des applications. Les principaux concepts liés à l'approche CI/CD sont l'intégration continue, la distribution continue et le déploiement continu. L'approche CI/CD représente une solution aux problèmes posés par l'intégration de nouveaux segments de code pour les équipes de développement et d'exploitation (ce qu'on appelle en anglais « integration hell », ou l'enfer de l'intégration).

Plus précisément, l'approche CI/CD garantit une automatisation et une surveillance continues tout au long du cycle de vie des applications, des phases d'intégration et de test jusqu'à la distribution et au déploiement. Ensemble, ces pratiques sont souvent désignées par l'expression « pipeline CI/CD » et elles reposent sur une collaboration agile entre les équipes de développement et d'exploitation, que ce soit dans le cadre d'une approche DevOps ou d'ingénierie de la fiabilité des sites (SRE).

## Les Outils

Différents outils servent à faire de la CI/CD, à savoir faire tourner des `pipelines` d'automatisation à l'aide de `runners` (instance isolée qui va exécuter le pipeline), les plus connus sont [Github Actions](https://github.com/features/actions), [Gitlab CI](https://docs.gitlab.com/ee/ci/) ou encore [Jenkins](https://www.jenkins.io/).

A ces outils permettant d'exécuter des pipelines CI/CD, s'ajoute des applications avec lesquels ces pipelines vont intéragir :

- [Sonarqube](https://www.sonarsource.com/products/sonarqube/) est un logiciel d'analyse de code, un agent va analyser le code source de l'application et générer un rapport qui sera envoyé au serveur Sonarqube qui présentera alors différentes statistiques sur une interface web.
    > *A noter qu'il est possible de paramétrer le serveur Sonarqube pour qu'une synthèse du rapport soit affichée directement dans la pull request associée à l'analyse.*
- [Trivy]() est un logiciel de détection de CVE (faille de sécurité), un agent analyse les dépendances (systèmes et applicatives) et génère un rapport des potentielles failles présentes dans l'application. Attention, une faille remontée n'est pas forcément exploitable par un attaquant et une relecture assidue dans le context de l'application est à prévoir.

## Les différentes phases

Chaque projet devrait suivre le maximum d'étapes de la CI/CD pour détecter les éventuels bugs ou régressions, contrôler la qualité du code, être averti de failles de sécurité. Ces différentes étapes peuvent se découper en 2 phases (pipelines).

### Intégration continue (CI)

L'intégration continue permet de garantir le bon fonctionnement de l'application lorsque de nouvelles fonctionnalités sont ajoutées (merge de pull request). L'équipe de développement écrit des tests automatisés (unitaires avec [Vitest](https://vitest.dev/) et de bout en bout avec [Cypress](https://www.cypress.io/)) qui seront joués par des machines distantes en suivant le scénario écrit sous forme de fichier `yaml`.

Les différentes étapes :

- Lint
- Tests (unitaires, d'intégration)
- Build
- Tests (de bout en bout)
- Analyse de qualité de code

### Déploiement continue (CD)

Le déploiement continue permet de livrer automatiquement une nouvelle version de l'application, à savoir figer une nouvelle version ou `tag` dans le gestion de sources (Git), générer et publier des notes de changements ainsi que la nouvelle version de l'application (sous forme de binaires, sources, image docker, etc...).

Les différentes étapes :

- Analyse de CVE / mauvaise configuration
- Release (+ génération du changelog)
- Déploiement
