# Health Profile

Projeto fullstack com backend em Django, frontend em Angular e banco de dados PostgreSQL.

## Requisitos

- Docker
- Docker Compose

## Configuração das variáveis de ambiente

Na raiz do projeto, copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com seus próprios valores:

```env
# Database
DB_NAME=examplename
DB_USER=exampleuser
DB_PASSWORD=change_this_password

# Django
DJANGO_SECRET_KEY=secret-key
DJANGO_DEBUG=True
```

| Variável          | Descrição                                 |
| ----------------- | ----------------------------------------- |
| DB_NAME           | Nome do banco de dados                    |
| DB_USER           | Usuário do banco de dados                 |
| DB_PASSWORD       | Senha do banco de dados                   |
| DJANGO_SECRET_KEY | Chave secreta do Django                   |
| DJANGO_DEBUG      | Liga ou desliga o modo debug (True/False) |

`DB_HOST` e `DB_PORT` já vêm definidos no `docker-compose.yaml`, então você não precisa colocar no `.env`.

## Executando com Docker Compose

Suba todos os serviços:

```bash
docker compose up --build
```

Aplique as migrações do banco (na primeira execução):

```bash
docker compose exec backend python manage.py migrate
```

## Acessos

- Frontend: http://localhost:4200
- Backend: http://localhost:8000
- PostgreSQL: localhost:5432

## Parando os serviços

```bash
docker compose down
```

Para remover também o volume do banco de dados:

```bash
docker compose down -v
```
