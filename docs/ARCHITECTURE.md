# Architecture & Design Patterns

## Project Structure

The project follows **Clean Architecture** principles with clear separation of concerns across three main layers:

```
├── app/                               # Next.js App Router
│   ├── (pages)/                       # Page routes (private & public)
│   ├── api/                           # API routes and middleware
│   ├── actions/                       # Server Actions
│   ├── components/                    # React components
│   ├── layout.tsx, providers.tsx      # Global setup
│   ├── loading.tsx                    # Global loading state
│   └── not-found.tsx                  # Global 404 (Not Found) page
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
├── hooks/                             # Custom React hooks
│   ├── useUser.ts, useRole.ts         # Auth state selectors
│   ├── usePermission.ts               # Permission checks
│   ├── useMobile.ts, useLogout.ts     # UI and session utilities
│   └── redux.hooks.ts                 # Typed Redux dispatch/selector hooks
│
├── lib/                               # Shared utilities (framework boundary)
│   ├── actions.utils.ts               # Server Action helpers and HOFs
│   ├── api.utils.ts                   # API route helpers (withAuthentication, handleApiError)
│   ├── csv.utils.ts                   # CSV export utilities
│   ├── formatters.utils.ts            # Date and string formatters
│   ├── logger.utils.ts                # Structured logger
│   ├── shared.utils.ts                # General-purpose helpers
│   └── sort.utils.ts                  # Sorting utilities
│
├── stores/                            # Redux state management
│   ├── index.ts                       # Store configuration
│   ├── store.provider.tsx             # Redux Provider wrapper
│   └── slices/                        # Feature slices
│
├── scripts/                           # Build and development scripts
│
├── tests/                             # Test infrastructure
│   ├── mocks/                         # Shared repository and entity mocks
│   └── utils/                         # Test helpers and utilities
│
├── __mocks__/                         # Jest manual mocks
│   ├── react-markdown.js              # Mock for react-markdown
│   └── core/                          # Mocks mirroring core/ module paths
│
└── public/                            # Static assets and generated files
    └── docs/                          # Generated API documentation artifacts
```

## Clean Architecture Layers

- **Domain Layer** — Pure business logic with no external dependencies
- **Application Layer** — Use cases that orchestrate domain logic
- **Infrastructure Layer** — Implementation of interfaces, database access, external services

This ensures testability, maintainability, and independence from frameworks.

## Key Patterns

| Pattern                    | Description                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| **Repository Pattern**     | All data access is abstracted through repositories that implement domain interfaces        |
| **Dependency Injection**   | Services are instantiated through factory functions (`*.factory.ts`)                       |
| **Factory Pattern**        | Single entry point for creating instances via `*Factory` functions                         |
| **Server Actions**         | All Server Actions are protected with `withSecuredActionAndAutomaticRetry` HOF             |
| **Dot Notation**           | Files follow pattern `name.type.ts` (e.g., `user.prisma.repository.ts`, `exam.actions.ts`) |
| **Intent-Revealing Names** | Names reveal business intent, not implementation details                                   |

## Database

- **Prisma ORM** with PostgreSQL
- **Native Adapter** — Uses `@prisma/adapter-pg` for Next.js compatibility
- **Migrations** — Version-controlled with Prisma Migrate
- **Seeding** — Initial data setup via `prisma/seed.ts`

For the full entity relationship diagram, see [SCHEMA.md](SCHEMA.md).

## Architecture Decision Records

The project documents major architectural decisions using the ADR pattern. See the [adr/](adr/) directory for details:

| ADR                                                   | Decision                            |
| ----------------------------------------------------- | ----------------------------------- |
| [ADR 001](adr/001-adoption-of-next-js.md)             | Adoption of Next.js                 |
| [ADR 002](adr/002-clean-architecture.md)              | Adoption of Clean Architecture      |
| [ADR 003](adr/003-adoption-of-prisma-orm.md)          | Adoption of Prisma ORM              |
| [ADR 004](adr/004-jose-token-handling.md)             | Choice of `jose` for token handling |
| [ADR 005](adr/005-adoption-of-async-local-storage.md) | Adoption of Async Local Storage     |
| [ADR 006](adr/006-schema-documentation-strategy.md)   | Schema documentation strategy       |
