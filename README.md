# SIMCASI — Syphilis Cases Monitoring System

A clinical case management system for centralizing and streamlining the monitoring of syphilis cases in healthcare units. Built for healthcare professionals to manage patient registries, treatment protocols, clinical exams, observations, role-based access control, and audit trails.

## Technologies

| Technology                                    | Purpose                         |
| --------------------------------------------- | ------------------------------- |
| [Next.js](https://nextjs.org/)                | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript            |
| [Prisma](https://www.prisma.io/)              | ORM for PostgreSQL              |
| [PostgreSQL](https://www.postgresql.org/)     | Relational database             |
| [Tailwind CSS](https://tailwindcss.com/)      | Utility-first styling           |
| [Zod](https://zod.dev/)                       | Schema validation               |
| [Jest](https://jestjs.io/)                    | Multi-project test suite        |
| [Docker](https://www.docker.com/)             | Database containerization       |

For the full dependency list, see [`package.json`](package.json).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/) (`corepack enable` or `npm i -g pnpm`)
- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- A [Resend](https://resend.com) account and API key (for password recovery)

### Setup

```bash
# 1. Clone and install
git clone https://github.com/thiagocrux/simcasi-fullstack
cd simcasi-fullstack
pnpm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your values (database credentials, API keys, etc.)

# 3. Start the database
docker-compose up -d

# 4. Apply migrations and seed initial data
pnpm prisma:migrate
pnpm prisma:generate
pnpm prisma:seed

# 5. (Optional) Load demo data — 35 patients with full clinical records
pnpm prisma:seed-demo-data

# 6. Start the development server
pnpm dev
```

The app will be available at `http://localhost:3000`.

> **Note:** `pnpm prisma:seed-demo-data` includes a production safety check and will not run when `NODE_ENV=production`.

### Default Credentials

After seeding, log in with:

| Field    | Value                    |
| -------- | ------------------------ |
| Email    | `simcasi.team@gmail.com` |
| Password | `Teste@12`               |

## Available Scripts

| Script                       | Description                                                 |
| ---------------------------- | ----------------------------------------------------------- |
| `pnpm dev`                   | Start the development server                                |
| `pnpm build`                 | Build for production                                        |
| `pnpm start`                 | Start the production server                                 |
| `pnpm lint`                  | Run ESLint                                                  |
| `pnpm test`                  | Run all tests (client, server, api-actions)                 |
| `pnpm test:watch`            | Run tests in watch mode                                     |
| `pnpm test:coverage`         | Run tests with coverage report                              |
| `pnpm prisma:migrate`        | Apply migrations (dev)                                      |
| `pnpm prisma:generate`       | Generate Prisma Client                                      |
| `pnpm prisma:migrate:deploy` | Apply migrations (production)                               |
| `pnpm prisma:migrate:reset`  | Reset the database (**deletes all data**)                   |
| `pnpm prisma:seed`           | Seed initial data                                           |
| `pnpm prisma:seed-demo-data` | Seed demo data (35 patients with full records)              |
| `pnpm prisma:studio`         | Open Prisma Studio                                          |
| `pnpm docs:generate`         | Bundle OpenAPI spec and generate Postman collection         |
| `pnpm docs:open`             | Open API docs in browser (`http://localhost:3000/api/docs`) |

## API Documentation

Interactive API docs are available at `http://localhost:3000/api/docs` when the dev server is running (powered by [Scalar](https://scalar.com/)).

You can also import the [Postman collection](public/docs/simcasi.postman_collection.json) for offline access. When updating endpoints, edit the corresponding YAML in `docs/openapi/` and run `pnpm docs:generate`.

The API is organized into three categories:

- **Identity & Access Management** — Auth, Users, Roles, Permissions, Sessions
- **Clinical Monitoring** — Patients, Exams, Treatments, Notifications, Observations
- **Governance & Operations** — Audit Logs, Health checks

## Architecture

SIMCASI follows **Clean Architecture** with three layers: Domain, Application, and Infrastructure. For detailed information on project structure, design patterns, database schema, and ADRs, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for code standards, workflow, commit conventions, and CI details.

## License

Distributed under the [MIT License](LICENSE).
