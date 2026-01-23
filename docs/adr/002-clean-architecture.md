# ADR 002: Adoption of Clean Architecture

- **Status:** Accepted
- **Date:** 2026-01-14
- **Deciders:** Thiago Luiz da Cruz Souza

## Context

The project needs to handle complex business rules regarding syphilis monitoring (cascade deletes, session rotation, audit logs) while remaining maintainable and testable over time. Common Next.js patterns often lead to "fat" route handlers or leakage of database logic into components.

## Decision

We have decided to adopt **Clean Architecture** as the primary structural pattern.

### Structure

- **Domain**: Pure business rules (Entities, Repositories, Errors). No dependencies.
- **Application**: Orchestration of logic (Use Cases, Contracts/DTOs).
- **Infrastructure**: Implementation details (Prisma Repositories, Jose Token Provider, Next.js Middleware).

## Rationale

1. **Framework Independence**: The core logic is decoupled from Next.js. We could swap the web framework or database ORM with minimal changes to the `domain` and `application` layers.
2. **High Maintainability**: By strictly separating concerns, changes to business rules are localized within use cases, preventing side effects in unrelated parts of the system (UI or Infrastructure).
3. **True Decoupling**: Infrastructure details (like Prisma or Jose) depend on domain interfaces, not the other way around. This inversion allows for easier evolution of technology stacks.
4. **Testability**: Use cases can be tested in isolation using mocks for repositories and providers.
5. **Intent-Revealing**: The structure follows "Uncle Bob's" principles, making it clear where business rules reside versus technical implementation.

## Consequences

- **Structural Complexity**: There is initial overhead in file creation (Factories, Contracts, Use Cases).
- **Reduced Operational Complexity**: While there are more files, the logic within them is simpler and safer to modify, leading to faster long-term development.
- **Learning Curve**: New developers might need time to understand the flow from API Route -> Factory -> Use Case -> Repository.
- **Rigidity in Domain**: Changes to core domain entities might require updates across multiple layers to maintain contract integrity.
