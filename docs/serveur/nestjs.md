# Construire un projet NestJS

## Conventions

Les noms des modules et fichiers associés de NestJS doivent respecter la convention du framework. Les noms sont au singulier: CatModule, CatService, CatController etc.

La structure est la suivante :

```
├── src
│   └── modules
│       └── cat
│           ├── controllers
│           │   ├── cat.controller.ts
│           │   └── cat.controller.spec.ts
│           ├── providers
│           │   ├── cat.service.ts
│           │   └── cat.service.spec.ts
│           ├── entity
│           │   └── cat.entity.ts
│           └── cat.module.ts
└ ...
```
