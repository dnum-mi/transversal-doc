# Conventions TypeScript

TypeScript (TS) est **très fortement** recommandé, et avec la version stricte : TS ne doit pas émettre de fichier JavaScript si le compilateur sort en erreur.

`any` doit être évité au maximum et devrait être très rare.

`object` doit être proscrit, même `Record<string | symbol, any>` est préférable.

`enum` est proscrit, de même que `namespace`. Ces deux fonctionnalités ne respectent pas l’esprit de TS, qui doit être uniquement du typage :

Avec les `enum`, le compilateur rajoute du code JS qui n’existe pas dans le code TS initial. La philosophie de TS est que si on enlève simplement le typage, le code doit être du JavaScript valide. Ce n’est pas le cas avec les `enum`. Or on peut obtenir la même chose avec les unions.

Ex. :

```
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
```

au lieu de

```
enum HttpMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Patch = 'PATCH',
}
```

Au lieu d’utilser les namespaces, il faut utiliser les modules. Cf. Cette réponse sur [SO](https://stackoverflow.com/questions/56059351/tslint-namespace-and-module-are-disallowed#56061134), par exemple.
