# Finance

A simple application to manage your budget and invoice. All features done in this project are base on my personal needs.

You can see the demo with the information below.

- demo: <https://finance.herynirintsoa.com>
- mail: <test-test@yopmail.fr>

![Finance demo](https://github.com/heryTz/finance/blob/main/demo.png?v=2)

⚠️ This project is a work in progress so it may contains breaking changes.

## Setup dev

Setup env

```bash
cp .env-example .env
```

Setup tools (db, mail server, adminer)

```bash
docker compose up
```

Setup db

```bash
npx prisma generate && npx prisma migrate dev
```

Start the application

```bash
pnpm dev
```

## Setup prod

Setup env

```bash
cp .env-example .env.production.local
```

Start the application

```bash
docker compose -f docker-compose.prod.yml up
```
