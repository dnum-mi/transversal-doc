# Conventions pour les API

cf. [Nommage](/conventions/api-restful)

## Nommage des routes

Les noms de routes d’API doivent **comporter uniquement des noms, jamais de verbes** et toujours au pluriel. C’est la méthode HTTP utilisée (d’ailleurs aussi appelée « verbe ») qui fait office de verbe.

Bien :

```http
/auth/token
/users/1
```

Mal :

```http
/session/create
/users/get/1
/user/1
```

Exemples :

- `POST /cats` (pour créer un cat)
- `GET /cats` (pour récupérer un tableaux de cats)
- `GET /cats/:id` (pour récupérer un cat)
- `PUT /cats/:id` (pour modifier toutes les propriétés d’un cat)
- `PATCH /cats/:id` (pour modifier une partie des propriétés d’un cat)
- `DELETE /cats/:id` (pour effacer un cat)

## Gestion de la journalisation

Les logs doivent sortir dans la sortie standard pour pouvoir être récupérés via les logs des conteneurs et être éventuellement redistribués à des [ELK](https://www.elastic.co/fr/elastic-stack/).

Chaque requête doit être loggée avec le temps de réponse.

Chaque action importante sur le serveur doit être journalisé (tentative de connexion, création d’un enregistrement/document...).

Les erreurs doivent être récupérées intelligemment et gérées à un seul endroit.

- `verbose` : Utilisé seulement dans un mode dev, pour retracer ce qu'il se passe (Exemple: Je viens de rentrer dans cette fonction)
- `debug` : Utilisé seulement dans un mode dev, dans des cas précis pour aider au debug
- `log` : Une information journalisée tout le temps, comme "serveur online"
- `warn` : Quelque chose qui est prévu mais non normal est arrivé
- `error` : Quelque chose de non prévu et anormal est arrivé. Quelque chose qui est grave et requiert l'attention d'un développeur

Les codes de retours HTTP doivent être cohérents avec ces erreurs.

Les retours d’erreur de l’API RESTful doivent être soit en français et compréhensible par l’utilisateur final, soit en clés qui correspondent à des clés d’un dictionnaire connu côté client.

## Les codes HTTP de retour

- `400` : je ne comprends pas ce que tu dis, qui que tu sois (qui que tu sois mais identifié)
- `401` : je ne sais pas qui tu es, ou bien je ne pense pas que tu sois la personne que tu prétends être, donc je ne te laisse pas rentrer (et mettre le header `WWW-Authenticate: Bearer` dans la réponse)
- `403` : je sais très bien qui tu es, et tel que je te connais, tu vas faire des dégâts, donc je ne te laisse pas rentrer
- `404` : J’ai tout compris, je sais qui tu es (ou je m’en moque) mais je n’ai pas ce que tu veux
- `409` : Conflit. J'ai bien compris ce que tu voulais créer mais cette ressource existe déjà, je ne peux pas l'écraser. (exemple: création d'une démarche avec un id de référence existante)
- `500` : j’ai compris ta requête, mais j’ai un gros problème pour y répondre : je ne sais pas faire

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
