# Construire un projet NestJS

## Conventions

Les noms des modules et fichiers associés de NestJS doivent respecter la convention du framework. Les noms sont au pluriel: CatsModule, CatsService, CatsController etc.

La structure est la suivante :

```tree
├── src
│   └── modules
│       └── cats
│           ├── controllers
│           │   ├── cats.controller.ts
│           │   └── cats.controller.spec.ts
│           ├── providers
│           │   ├── cats.service.ts
│           │   └── cats.service.spec.ts
│           ├── entity
│           │   └── cats.entity.ts
│           └── cats.module.ts
└ ...
```
