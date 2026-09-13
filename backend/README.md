# Albiri Hospital Backend

Node.js, Express, Prisma ORM, and MySQL. Requires Node.js 22.12+.

## Development

Run from this backend directory. On Windows PowerShell, use `npm.cmd` if script execution is disabled.

```sh
npm install
npm run db:generate
npm run dev
```

Local configuration is in `.env` (ignored by Git). On a new checkout, copy `.env.example` to `.env`. The included passwords are for local development only.

The API defaults to http://127.0.0.1:5000. `GET /api/health` checks the API; `GET /api/health/db` checks MySQL and returns 503 when it is unavailable.

## MySQL

With Docker Desktop installed and running:

```sh
npm run db:up
```

Alternatively, start an existing MySQL server, create an `albiri_hospital` database, and set `DATABASE_URL` in `.env` to its credentials. Percent-encode special characters in URL credentials. The separate MYSQL_* values configure the Docker container; keep these consistent with DATABASE_URL when using Docker. Container credentials only initialize an empty data volume.

No application tables are assumed. Add your models to `prisma/schema.prisma`, then run:

```sh
npm run db:migrate -- --name init
npm run db:generate
```

For development migrations, the MySQL user needs permission to create a shadow database, or configure a separate shadow database in Prisma configuration. Use an appropriately privileged local development account for migrations.

`npm run db:studio` opens the database browser. `npm run db:down` stops the container while preserving data. Use `npm run db:deploy` to apply committed migrations in deployments.
