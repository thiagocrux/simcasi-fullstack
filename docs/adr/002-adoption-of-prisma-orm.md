# ADR 002: Adoption of Prisma ORM

- **Status:** Accepted
- **Date:** 2025-12-11
- **Deciders:** Thiago Luiz da Cruz Souza

## Context

The system requires a robust, type-safe, and developer-friendly way to interact with the PostgreSQL database. Given the complexity of the domain models (syphilis monitoring, audit logs, RBAC), manual SQL or lightweight query builders might lead to maintenance issues and lack of type safety.

## Decision

We have decided to use **Prisma ORM** as the primary database abstraction tool.

## Rationale

1.  **Type Safety**: Prisma generates a TypeScript client based on the schema, providing full type safety across the application, which is crucial for a complex domain.
2.  **Schema-First Design**: The single `schema.prisma` file acts as the source of truth for both the database structure and the application's types.
3.  **Migration Management**: Prisma Migrate provides a structured way to handle schema évolutions with version-controlled SQL files.
4.  **Developer Experience**: The declarative syntax and visual tools (Prisma Studio) significantly speed up development and debugging.

## Consequences

- **Abstraction Layer**: The application depends on Prisma's ecosystem, which might introduce slight overhead compared to raw SQL.
- **Runtime Engine**: Prisma requires a binary or library engine, which was addressed using `@prisma/adapter-pg` to ensure compatibility with Next.js and typical serverless environments.
- **Vendor Lock-in**: Switching to another ORM or database type (e.g., NoSQL) would require a significant rewrite of the infrastructure layer.
