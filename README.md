# Syphilis Cases Monitoring System (Simcasi)

This is a fullstack application designed to monitor and manage syphilis cases.

## Technologies

The project uses a modern toolchain focused on developer experience and performance:

- `next` — The React Framework for the Web.
- `react` — The library for web and native user interfaces.
- `prisma` — Next-generation ORM for Node.js and TypeScript.
- `postgresql` — The World's Most Advanced Open Source Relational Database.
- `tailwindcss` — Utility-first CSS framework for styling.
- `pnpm` — Fast and disk-efficient JavaScript package manager.
- `docker` — Platform for developing, shipping, and running applications.

## Prerequisites

Before installing and running this app, make sure you have the following installed on your machine:

- Node.js (recommended v18+; verify with `node -v`)
- pnpm (package manager; install via `corepack enable` or `npm i -g pnpm`)
- Docker & Docker Compose (for running the database)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/thiagocrux/simcasi-fullstack
cd simcasi-fullstack
```

2. Install dependencies:

```bash
pnpm install
```

3. Setup Environment Variables:

   Create a `.env` file in the root directory. Ensure you have the necessary variables for Docker and Prisma. Example:

   ```env
   # Database Configuration for Docker
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DATABASE=simcasi
   POSTGRES_HOST_PORT=5432
   POSTGRES_CONTAINER_PORT=5432

   # Prisma Connection String
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/simcasi?schema=public"
   ```

4. Start the database:

   This project uses PostgreSQL with Docker. Start the database container:

   ```bash
   docker-compose up -d
   ```

5. Setup the database with Prisma:

   Run the migrations to apply the schema to the database:

   ```bash
   pnpm prisma:migrate
   ```

   Generate the Prisma Client type definitions:

   ```bash
   pnpm prisma:generate
   ```

   Seed the database with initial data:

   ```bash
   pnpm prisma:seed
   ```

6. Run the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Available scripts

This section documents the main scripts available in `package.json` and what they do.

### Development

- #### `dev`

  Starts the Next.js development server.

  ```bash
  pnpm dev
  ```

- #### `prisma:studio`

  Opens Prisma Studio, a visual editor for your database.

  ```bash
  pnpm prisma:studio
  ```

### Production

- #### `build`

  Builds the application for production.

  ```bash
  pnpm build
  ```

- #### `start`

  Starts the production server.

  ```bash
  pnpm start
  ```

- #### `prisma:migrate:deploy`

  Runs pending migrations for production environments.

  ```bash
  pnpm prisma:migrate:deploy
  ```

### Database Management

- #### `prisma:migrate`

  Runs `prisma migrate dev` to apply migrations to the development database.

  ```bash
  pnpm prisma:migrate
  ```

- #### `prisma:generate`

  Generates the Prisma Client based on your schema.

  ```bash
  pnpm prisma:generate
  ```

- #### `prisma:migrate:reset`

  Resets the database (Caution: deletes all data).

  ```bash
  pnpm prisma:migrate:reset
  ```

- #### `prisma:seed`

  Seeds the database with initial data.

  ```bash
  pnpm prisma:seed
  ```

## License

[MIT](https://choosealicense.com/licenses/mit/)
