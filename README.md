# SIMCASI — Syphilis Cases Monitoring System

A clinical case management system designed to centralize and streamline the monitoring of syphilis cases in healthcare units. SIMCASI (acronym for Sistema de Monitoramento de Casos de Sífilis) enables healthcare professionals to maintain centralized patient registries, track treatment protocols and clinical exams, document observations, manage access permissions by role, and maintain complete audit trails for governance and compliance.

## Technologies

The project uses a modern toolchain focused on developer experience and performance:

- `@apidevtools/swagger-cli` — OpenAPI specification bundler and validator.
- `@radix-ui/*` — Unstyled, accessible component primitives.
- `@scalar/nextjs-api-reference` — Interactive API documentation UI.
- `@tanstack/react-query` — Powerful asynchronous state management.
- `@tanstack/react-table` — Headless UI table library for data tables.
- `bcryptjs` — Password hashing library.
- `docker` — Platform for developing, shipping, and running applications.
- `jose` — JSON Web Token (JWT) handling.
- `next` — The React Framework for the Web with App Router.
- `postgresql` — The World's Most Advanced Open Source Relational Database.
- `prisma` — Next-generation ORM for Node.js and TypeScript.
- `react` — The library for web and native user interfaces.
- `react-hook-form` — Performant, flexible form library with easy validation.
- `tailwindcss` — Utility-first CSS framework for styling.
- `typescript` — Typed superset of JavaScript.
- `zod` — TypeScript-first schema validation.

_For more information about other dependencies, see the `package.json` file._

## Prerequisites

Before installing and running this app, make sure you have the following installed on your machine:

- Node.js (recommended v18+; verify with `node -v`)
- pnpm (package manager; install via `corepack enable` or `npm i -g pnpm`)
- Docker & Docker Compose (for running the database)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/thiagocrux/simcasi-fullstack
cd simcasi-fullstack
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory. Ensure you have the necessary variables for Docker and Prisma. Example:

```env
# -- DOCKER --

# POSTGRES_DATABASE: The name of your PostgreSQL database.
# The value you set here will be used by Docker Compose to create the database when the container starts, and it will also be used by the application to connect to the database.
POSTGRES_DATABASE="simcasi"

# POSTGRES_USER: The username for your PostgreSQL database.
# Update as needed to match your database user.
POSTGRES_USER="root"

# POSTGRES_PASSWORD: The password for your PostgreSQL database.
# Update as needed to match your database password.
POSTGRES_PASSWORD="root"

# POSTGRES_HOST: The host address for your PostgreSQL database.
# Default is 'localhost', change if your database is hosted elsewhere.
POSTGRES_HOST="localhost"

# POSTGRES_HOST_PORT: The port on your host machine mapped to the PostgreSQL container.
# Default PostgreSQL port is 5432, update if you use a different port.
POSTGRES_HOST_PORT=5432

# POSTGRES_CONTAINER_PORT: The port inside the PostgreSQL container.
# Default PostgreSQL port is 5432, update if you use a different port.
POSTGRES_CONTAINER_PORT=5432

# -- PRISMA --

# DATABASE_URL: The connection string for your PostgreSQL database.
# This URL is used by Prisma and your application to connect to the database. It includes the username, password, host, port, database name, and schema.
DATABASE_URL="postgresql://root:root@localhost:5432/simcasi"

# PRISMA_SEED_EMAIL: The email address used by Prisma seed scripts when creating the default seeded user.
# Update this to change the email for the seeded user created during development or deployment seeding.
PRISMA_SEED_EMAIL="simcasi.team@gmail.com"

# PRISMA_SEED_PASSWORD: The password for the seeded user created by Prisma seed scripts.
# Use a secure password for production; this is commonly used only during development/testing.
PRISMA_SEED_PASSWORD="Teste@12"

# -- SECURITY --

# JWT_SECRET: The secret key used to sign and verify JSON Web Tokens (JWT).
# Keep this value secure and never commit it to a public repo. Use different secrets per environment.
JWT_SECRET="R0hPtlxlGK7k3XC8Kdjn/bYYsHH5J1T4PoYaNAAmi2g="

# JWT_ACCESS_TOKEN_EXPIRATION: Expiration time for access tokens (short-lived).
# Use duration strings like '15m' for 15 minutes or '1h' for 1 hour to limit exposure if leaked.
JWT_ACCESS_TOKEN_EXPIRATION="15m"

# JWT_REFRESH_TOKEN_EXPIRATION: Expiration time for refresh tokens (longer-lived).
# Use duration strings like '7d' for 7 days; refresh tokens are used to obtain new access tokens.
JWT_REFRESH_TOKEN_EXPIRATION="7d"
```

### 4. Start the Database

This project uses PostgreSQL with Docker. Start the database container:

```bash
docker-compose up -d
```

### 5. Setup the Database with Prisma

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

### 6. Run the Development Server

```bash
pnpm dev
```

> 📝 **Note:** The application will be available at `http://localhost:3000`.

## Quick Start

Get the application running in less than 5 minutes.

### Option 1: Step-by-Step (Recommended for first-time setup)

```bash
# 1. Clone repository and install dependencies
git clone https://github.com/thiagocrux/simcasi-fullstack
cd simcasi-fullstack
pnpm install

# 2. Start the database
docker-compose up -d

# 3. Setup database schema and seed initial data
pnpm prisma:migrate
pnpm prisma:seed

# 4. Start development server
pnpm dev

# 5. View the application and API documentation
# Open http://localhost:3000 in your browser
# API docs: http://localhost:3000/api/docs
```

### Option 2: One-Command Setup (If you have all prerequisites installed)

```bash
git clone https://github.com/thiagocrux/simcasi-fullstack && \
cd simcasi-fullstack && \
docker-compose up -d && \
pnpm install && \
pnpm prisma:migrate && \
pnpm prisma:seed && \
pnpm dev
```

### Option 3: Auto-Open Documentation

After running the dev server (from Option 1 or 2), in a new terminal:

```bash
pnpm docs:open
```

This will automatically open `http://localhost:3000/api/docs` in your default browser.

### Default Credentials (from seed)

Once setup is complete, you can login with:

- **Email:** `simcasi.team@gmail.com`
- **Password:** `Teste@12`

> 📝 **Note:** Change these credentials in `prisma/seed.ts` before using in production.

## Available Scripts

This section documents the main scripts available in `package.json` and what they do.

### Development

- #### `dev`

  Starts the Next.js development server.

  ```bash
  pnpm dev
  ```

- #### `lint`

  Runs ESLint to check for code quality issues.

  ```bash
  pnpm lint
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

### Documentation

- #### `docs:bundle`

  Bundles the OpenAPI specification from modular YAML files into a single JSON file.

  ```bash
  pnpm docs:bundle
  ```

- #### `docs:postman`

  Generates a Postman collection from the OpenAPI specification and organizes it with nested folders.

  ```bash
  pnpm docs:postman
  ```

- #### `docs:generate`

  Runs both `docs:bundle` and `docs:postman` to generate all API documentation artifacts.

  ```bash
  pnpm docs:generate
  ```

- #### `docs:open`

  Opens the Scalar API documentation in your default browser. Waits for the dev server to be ready before opening.

  ```bash
  pnpm docs:open
  ```

  > 📝 **Note:** Make sure the dev server is running (`pnpm dev`) before executing this command. This will open `http://localhost:3000/api/docs`.

## API Documentation

The API documentation is built with OpenAPI 3.0.3 and served through multiple tools for different use cases.

### Accessing the Documentation

Once the development server is running, access the interactive API documentation at:

```
http://localhost:3000/api/docs
```

This provides a live, interactive interface powered by [Scalar](https://scalar.com/) where you can:

- Browse all available endpoints
- View request/response schemas
- Test API calls directly from the documentation

> 📝 **Note:** You can also import the [Postman collection](public/docs/simcasi.postman_collection.json) into Postman for offline access and advanced testing features.

### Documentation Structure

The API documentation is organized into three main categories:

1. **Identity & Access Management** — Authentication, Users, Roles, Permissions, and Sessions
2. **Clinical Monitoring** — Patients, Exams, Treatments, Notifications, and Observations
3. **Governance & Operations** — Audit Logs and System health checks

### Working with API Artifacts

The documentation artifacts are automatically generated and stored in `public/docs/`:

- **`openapi.json`** — Complete OpenAPI specification (auto-bundled from modular YAML files)
- **`simcasi.postman_collection.json`** — Postman collection for API testing (organized with nested folders)

### Updating Documentation

When you add or modify API endpoints:

1. Update the corresponding YAML file in `docs/openapi/` directory
2. Include proper descriptions, parameters, and request/response examples
3. Run `pnpm docs:generate` to regenerate all artifacts
4. The Scalar UI will automatically reflect your changes on the next page reload

## Project Structure

The project follows **Clean Architecture** principles with clear separation of concerns across three main layers:

```
├── app/                               # Next.js App Router
│   ├── (pages)/                       # Page routes (private & public)
│   ├── api/                           # API routes and middleware
│   ├── actions/                       # Server Actions
│   ├── components/                    # React components
│   └── layout.tsx, providers.tsx      # Global setup
│
├── core/                              # Business logic layer
│   ├── domain/                        # Domain entities and interfaces
│   │   ├── entities/                  # TypeScript interfaces/types
│   │   ├── repositories/              # Repository interfaces
│   │   ├── errors/                    # Domain-specific errors
│   │   └── constants/                 # Business constants
│   │
│   ├── application/                   # Use cases (business rules)
│   │   ├── use-cases/                 # Business logic orchestration
│   │   ├── contracts/                 # DTOs and service contracts
│   │   └── validation/                # Zod schemas for validation
│   │
│   └── infrastructure/                # Implementation details
│       ├── repositories/              # Database implementations
│       ├── factories/                 # Dependency injection factories
│       ├── providers/                 # External service implementations
│       ├── middleware/                # Auth and security middleware
│       └── lib/                       # Utilities and configurations
│
├── prisma/                            # Database schema and migrations
│   ├── schema.prisma                  # Data model
│   └── migrations/                    # Database versions
│
├── docs/openapi/                      # API documentation (YAML)
│
├── scripts/                           # Build and development scripts
│   ├── generate-postman-collection.js # Postman collection post-processing
│   └── open-docs.js                   # Opens Scalar UI in default browser
│
├── public/                            # Static assets and generated files
│   ├── docs/                          # Generated API documentation artifacts
│   │   ├── openapi.json                     # Bundled OpenAPI specification
│   │   └── simcasi.postman_collection.json  # Postman collection
│   ├── scripts/                       # Client-side scripts
│   └── ...                            # Images, icons, other static assets
```

## Architecture & Design Patterns

### Clean Architecture

The codebase respects the principles of Clean Architecture:

- **Domain Layer** — Pure business logic with no external dependencies
- **Application Layer** — Use cases that orchestrate domain logic
- **Infrastructure Layer** — Implementation of interfaces, database access, external services

This ensures testability, maintainability, and independence from frameworks.

### ADRs (Architecture Decision Records)

The project documents its major architectural decisions using the ADR pattern. Refer to [docs/adr/](docs/adr/) for details on:

- **ADR 001**: Adoption of Next.js.
- **ADR 002**: Adoption of Clean Architecture.
- **ADR 003**: Adoption of Prisma ORM.
- **ADR 004**: Choice of `jose` for Token Handling.

### Key Patterns

- **Repository Pattern** — All data access is abstracted through repositories that implement domain interfaces
- **Dependency Injection** — Services are instantiated through factory functions (`*.factory.ts`)
- **Factory Pattern** — Single entry point for creating instances via `*Factory` functions
- **Server Actions** — All Server Actions are protected with `withSecuredActionAndAutomaticRetry` HOF
- **Dot Notation** — Files follow pattern `name.type.ts` (e.g., `user.prisma.repository.ts`, `exam.actions.ts`)
- **Intent-Revealing Names** — Names reveal business intent, not implementation details

### Database

- **Prisma ORM** with PostgreSQL
- **Native Adapter** — Uses `@prisma/adapter-pg` for Next.js compatibility
- **Migrations** — Version-controlled with Prisma Migrate
- **Seeding** — Initial data setup via `prisma/seed.ts`

#### Database Schema

The following diagram represents the core entity relationships within the SIMCASI database:

```mermaid
erDiagram
    Role ||--o{ User : "has many"
    Role ||--o{ RolePermission : "contains"
    Permission ||--o{ RolePermission : "assigned to"
    User ||--o{ Session : "owns"
    User ||--o{ Patient : "creates"
    User ||--o{ Exam : "creates"
    User ||--o{ Notification : "creates"
    User ||--o{ Observation : "creates"
    User ||--o{ Treatment : "creates"
    User ||--o{ AuditLog : "triggers"
    Patient ||--o{ Exam : "undergoes"
    Patient ||--o{ Notification : "notified of"
    Patient ||--o{ Observation : "observed for"
    Patient ||--o{ Treatment : "receives"

    Role {
        uuid id PK
        string code UK
        uuid createdBy FK
        uuid updatedBy FK
        timestamptz createdAt
        timestamptz updatedAt
        timestamptz deletedAt
    }

    Permission {
        uuid id PK
        string code UK
        uuid createdBy FK
        uuid updatedBy FK
        timestamptz createdAt
        timestamptz updatedAt
        timestamptz deletedAt
    }

    RolePermission {
        uuid roleId PK, FK
        uuid permissionId PK, FK
    }

    User {
        uuid id PK
        string name
        string email UK
        string password
        uuid roleId FK
        boolean isSystem
        uuid createdBy FK
        uuid updatedBy FK
        timestamptz createdAt
        timestamptz updatedAt
        timestamptz deletedAt
    }

    Patient {
        uuid id PK
        string susCardNumber UK
        string cpf UK
        string name
        string socialName
        date birthDate
        string race
        string sex
        string gender
        string sexuality
        string nationality
        string schooling
        string phone
        string email
        string motherName
        string fatherName
        boolean isDeceased
        string monitoringType
        string zipCode
        string state
        string city
        string neighborhood
        string street
        string houseNumber
        string complement
        uuid createdBy FK
        uuid updatedBy FK
        timestamptz createdAt
        timestamptz updatedAt
        timestamptz deletedAt
    }

    Exam {
        uuid id PK
        uuid patientId FK
        string treponemalTestType
        string treponemalTestResult
        date treponemalTestDate
        string treponemalTestLocation
        string nontreponemalVdrlTest
        string nontreponemalTestTitration
        date nontreponemalTestDate
        string otherNontreponemalTest
        date otherNontreponemalTestDate
        string referenceObservations
        uuid createdBy FK
        uuid updatedBy FK
        timestamptz createdAt
        timestamptz updatedAt
        timestamptz deletedAt
    }

    Notification {
        uuid id PK
        uuid patientId FK
        string sinan
        string observations
        uuid createdBy FK
        uuid updatedBy FK
        timestamptz createdAt
        timestamptz updatedAt
        timestamptz deletedAt
    }

    Observation {
        uuid id PK
        uuid patientId FK
        string observations
        boolean hasPartnerBeingTreated
        uuid createdBy FK
        uuid updatedBy FK
        timestamptz createdAt
        timestamptz updatedAt
        timestamptz deletedAt
    }

    Treatment {
        uuid id PK
        uuid patientId FK
        string medication
        string healthCenter
        date startDate
        string dosage
        string observations
        string partnerInformation
        uuid createdBy FK
        uuid updatedBy FK
        timestamptz createdAt
        timestamptz updatedAt
        timestamptz deletedAt
    }

    Session {
        uuid id PK
        uuid userId FK
        timestamptz issuedAt
        timestamptz expiresAt
        inet ipAddress
        string userAgent
        timestamptz createdAt
        timestamptz updatedAt
        timestamptz deletedAt
    }

    AuditLog {
        uuid id PK
        uuid userId FK
        string action
        string entityName
        uuid entityId
        json oldValues
        json newValues
        inet ipAddress
        string userAgent
        timestamptz createdAt
    }
```

> 📝 **Note:** This diagram focuses on clear relationships and core types. For technical implementation details such as performance indexes, `CASCADE` rules, constraints and optional fields, please refer to the [prisma/schema.prisma](prisma/schema.prisma) file.

## Contributing

This section guides you on maintaining code quality and proper documentation.

### Code Standards

When working on the codebase:

- Follow the **Clean Architecture** principles outlined in the Project Structure section
- Use **Intent-Revealing Names** — names should reveal business intent, not implementation details
- Maintain **Dot Notation** — files follow pattern `name.type.ts` (e.g., `user.prisma.repository.ts`, `exam.actions.ts`)
- Write **expressive comments** — keep them accessible to junior developers
- Use **Zod schemas** for validation, especially in forms and Server Actions

### Adding or Modifying API Endpoints

When working with the API:

1. **Update OpenAPI Specification**
   - Modify the corresponding YAML file in `docs/openapi/`
   - Follow the existing structure and conventions
   - Include proper descriptions, parameters, and examples

2. **Add Comprehensive Examples**
   - Include request body examples with realistic data
   - Document response examples for success and error cases
   - Use proper status codes and error types

3. **Regenerate Documentation**
   - Run `pnpm docs:generate` to bundle and create the Postman collection
   - Verify changes in Scalar UI at `http://localhost:3000/api/docs`
   - Test in Postman using the generated collection

4. **Follow Commit Conventions**
   - Use [Conventional Commits](https://www.conventionalcommits.org/) format
   - Example: `docs: add new endpoint descriptions for patient endpoints`
   - Keep commits focused on a single feature or fix

### Code Quality Checks

- **Linting** — Run `pnpm lint` to check code style
- **Type Safety** — Ensure TypeScript compilation passes
- **Atomic Commits** — Keep commits focused and meaningful

## Troubleshooting

### Common Issues

#### Database: `Can't reach database server at 127.0.0.1:5432`

- **Reason**: The application cannot connect to the PostgreSQL instance. This usually happens because the Docker container is stopped or the database hasn't finished its initialization.
- **Solution**:
  1.  Check if the Docker container is running: `docker compose ps`.
  2.  If it's stopped, start it: `docker-compose up -d`.
  3.  Verify the `DATABASE_URL` in your `.env` file matches the Docker settings (port 5432 is the default).
  4.  Wait a few seconds after starting Docker for the database to be ready before running commands like `prisma:migrate` or starting the dev server.

## License

Distributed under the [MIT License](LICENSE).
