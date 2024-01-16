# FINANCE

⚠️ The aim of this project is to experiment with the new features of NextJS.

A simple application to manage your budget and invoice. You can see the demo with the information below.

- demo: <https://finance.herynirintsoa.com>
- mail: <test-test@yopmail.fr>

![Finance demo](https://github.com/heryTz/finance/blob/main/demo.gif)

## Setup

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

## TODO

- [ ] Make code base consistent
- [ ] Use server action and server component if possible
- [x] Improve ```apiGuard``` by throw Exception when unauthorized
