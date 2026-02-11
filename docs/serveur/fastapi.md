# Construire un projet FastAPI

[FastAPI](https://fastapi.tiangolo.com/) est un framework web Python moderne et performant, basé sur les annotations de type Python et [Pydantic](https://docs.pydantic.dev/). Il génère automatiquement la documentation OpenAPI.

## Initialisation d'un projet

Utiliser [uv](https://docs.astral.sh/uv/) pour gérer le projet Python et ses dépendances :

```shell
uv init my-api && cd my-api
uv add "fastapi[standard]"
```

Cela génère un fichier `pyproject.toml` avec les métadonnées du projet et un fichier `uv.lock` verrouillant les dépendances.

::: tip
Pour lancer le serveur de développement :

```shell
uv run fastapi dev
```

:::

## Structure du projet

cf. [Architecture de dossiers](/conventions/architecture-dossiers)

```txt
├── app
│   ├── __init__.py
│   ├── main.py                # Point d'entrée FastAPI
│   ├── config.py              # Configuration (variables d'env)
│   ├── models
│   │   ├── __init__.py
│   │   └── cat.py             # Modèles SQLAlchemy / Tortoise
│   ├── schemas
│   │   ├── __init__.py
│   │   └── cat.py             # Schémas Pydantic
│   ├── routers
│   │   ├── __init__.py
│   │   └── cats.py            # Routes /cats
│   ├── services
│   │   ├── __init__.py
│   │   └── cats.py            # Logique métier
│   └── utils
│       ├── __init__.py
│       └── logger.py
├── tests
│   ├── __init__.py
│   └── test_cats.py
├── pyproject.toml
├── uv.lock
└── Dockerfile
```

## Conventions

### Validation avec Pydantic

La validation des données entrantes et sortantes se fait avec des modèles [Pydantic](https://docs.pydantic.dev/) :

```python
from pydantic import BaseModel, Field


class CatBase(BaseModel):
    name: str = Field(min_length=1, description="Nom du chat")
    age: int = Field(ge=0, description="Âge du chat")


class CatCreate(CatBase):
    pass


class CatResponse(CatBase):
    id: int

    model_config = {"from_attributes": True}
```

### Routes (Routers)

Utiliser les `APIRouter` pour organiser les routes par domaine :

```python
from fastapi import APIRouter, HTTPException, status

from app.schemas.cat import CatCreate, CatResponse
from app.services.cats import CatsService

router = APIRouter(prefix="/cats", tags=["cats"])


@router.get("/", response_model=list[CatResponse])
async def get_cats():
    return await CatsService.find_all()


@router.get("/{cat_id}", response_model=CatResponse)
async def get_cat(cat_id: int):
    cat = await CatsService.find_by_id(cat_id)
    if not cat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cat non trouvé",
        )
    return cat


@router.post("/", response_model=CatResponse, status_code=status.HTTP_201_CREATED)
async def create_cat(cat: CatCreate):
    return await CatsService.create(cat)
```

Enregistrer les routers dans `main.py` :

```python
from fastapi import FastAPI

from app.routers import cats

app = FastAPI(title="Mon API", version="1.0.0")
app.include_router(cats.router)
```

### Endpoints asynchrones

Privilégier les fonctions `async` pour les endpoints qui font des I/O (base de données, appels HTTP, etc.) :

```python
# ✅ Bien : async pour les opérations I/O
@router.get("/cats")
async def get_cats():
    return await db.fetch_all(query)

# ✅ Bien : sync pour les opérations CPU-bound
@router.get("/compute")
def compute_something():
    return heavy_computation()
```

## Logging

Utiliser le module `logging` standard de Python avec une configuration structurée et le pattern `lifespan` (recommandé depuis FastAPI 0.93+, `@app.on_event("startup")` est déprécié) :

```python
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Code exécuté au démarrage
    logger.info("Application démarrée")
    yield
    # Code exécuté à l'arrêt
    logger.info("Application arrêtée")


app = FastAPI(lifespan=lifespan)
```

## Gestion des erreurs

Créer des gestionnaires d'exceptions personnalisés :

```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


class AppException(Exception):
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail


app = FastAPI()


@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "timestamp": datetime.now(UTC).isoformat(),
        },
    )
```

## Documentation OpenAPI

FastAPI génère automatiquement la documentation OpenAPI, accessible par défaut à :

- **Swagger UI** : `/docs`
- **ReDoc** : `/redoc`

## Tests

Ajouter les dépendances de test :

```shell
uv add --dev pytest httpx
```

Utiliser `pytest` avec le `TestClient` de FastAPI :

```python
import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_get_cats():
    response = client.get("/cats")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_cat():
    response = client.post("/cats", json={"name": "Minou", "age": 3})
    assert response.status_code == 201
    assert response.json()["name"] == "Minou"
```

Lancer les tests :

```shell
uv run pytest
```

## Dockerfile

Exemple de Dockerfile multi-stage optimisé avec uv :

```dockerfile
# Build
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS builder
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy

WORKDIR /app
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --locked --no-install-project --no-dev
COPY . /app
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev

# Runtime
FROM python:3.12-slim-bookworm

RUN groupadd --system --gid 999 nonroot \
 && useradd --system --gid 999 --uid 999 --create-home nonroot

COPY --from=builder --chown=nonroot:nonroot /app /app
ENV PATH="/app/.venv/bin:$PATH"
USER nonroot
WORKDIR /app

CMD ["fastapi", "run", "--host", "0.0.0.0", "app/main.py"]
```

## Du POC à la production

cf. [POC to Prod](/conventions/poc-to-prod) pour une checklist complète de mise en production d'un projet FastAPI.
