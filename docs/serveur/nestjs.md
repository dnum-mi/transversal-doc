# Construire un projet NestJS

## Conventions

### Conventions de nommage

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

## Log

Le logger recommandé pour nestjs est [nestjs-pino](https://github.com/iamolegga/nestjs-pino), qui permet d’avoir des logs en JSON sans aucune configuration.

Installer les deux packages npm `nestjs-pino` et `pino-http`.

L’implémentation se fait en 2 étapes :

1. Dans `app.module.ts`, ajouter ceci :

```diff
+import { LoggerModule } from 'nestjs-pino';

 @Module({
+  imports: [LoggerModule.forRoot()],
 })
 class AppModule {}
```

2. Modifier `main.ts` comme suit :

```diff
 import { NestFactory } from '@nestjs/core'
+import { Logger } from 'nestjs-pino';

+import { AppModule } from './app.module'

 async function bootstrap() {
-  const app = await NestFactory.create(AppModule)
+  const app = await NestFactory.create(AppModule, { bufferLogs: true })
+  app.useLogger(app.get(Logger))
   await app.listen(3000)
 }
 bootstrap()
```

Désormais, toutes les requêtes seront loggées comme dans cet exemple :

```
{"level":30,"time":1692613948292,"pid":12000,"hostname":"MacBook-Air-de-Foo.local","req":{"id":1,"method":"GET","url":"/","query":{},"params":{"0":""},"headers":{"accept-encoding":"gzip, deflate, br","accept":"*/*","user-agent":"Thunder Client (https://www.thunderclient.com)","host":"localhost:3000","connection":"close"},"remoteAddress":"::ffff:127.0.0.1","remotePort":58635},"res":{"statusCode":200,"headers":{"x-powered-by":"Express","content-type":"text/html; charset=utf-8","content-length":"12","etag":"W/\"c-Lve95gjOVATpfV8EL5X4nxwjKHE\""}},"responseTime":12,"msg":"request completed"}
```

Un exemple d’utilisation du logger :

```typescript
// NestJS standard built-in logger.
// Logs will be produced by pino internally
import { Logger } from '@nestjs/common';

export class MyService {
  private readonly logger = new Logger(MyService.name);
  foo() {
    // All logger methods have args format the same as pino, but pino methods
    // `trace` and `info` are mapped to `verbose` and `log` to satisfy
    // `LoggerService` interface of NestJS:
    this.logger.verbose({ foo: 'bar' }, 'baz %s', 'qux');
    this.logger.debug('foo %s %o', 'bar', { baz: 'qux' });
    this.logger.log('foo');
  }
}
```

## Gestion des erreurs

Créer un *filter* qui interceptera toutes les erreurs et les loggera d’une part, et les

```typescript
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, LoggerService } from '@nestjs/common'
import { Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse()
    const error: { message: string } = typeof response === 'string' ? { message: response } : (exceptionResponse as Error)

    this.logger.error(new Error(error.message))

    response.status(status).json({
      ...error,
      timestamp: new Date().toISOString(),
    })
  }
}
```

## Docs

L’API doit fournir une documentation OpenAPI à jour.

Pour cela, il faut utiliser `@nestjs/swagger` telle que documenté [ici dans la documentation officielle de nestjs](https://docs.nestjs.com/openapi/introduction).
