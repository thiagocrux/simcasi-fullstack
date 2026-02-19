# ADR 006: Schema Documentation Strategy

- **Status:** Accepted
- **Date:** 2025-12-11
- **Deciders:** Thiago Luiz da Cruz Souza

## Context

The SIMCASI project uses Prisma ORM to manage the database schema. While external documentation (like ADRs) is useful for high-level architectural decisions, table-specific business rules—such as soft-delete behaviors, uniqueness invariants, and cascading logic—are often decoupled from the code. This separation leads to "knowledge rot" where developers might miss critical implementation details while working on model-related code or repositories.

## Decision

We have decided to incorporate **architectural and logical notes directly within the `schema.prisma` file**. These notes will document the purpose, behavior, and specific logic of each domain record.

## Rationale

1.  **High Visibility**: Placing documentation right above the model definition ensures and mandates that developers see implementation requirements (like soft-delete handling) while they are working with the data structure.
2.  **Informed Maintenance**: Clear notes on uniqueness invariants (e.g., uniqueness across both active and soft-deleted records) prevent accidental data corruption or logic errors during record creation or restoration.
3.  **Single Source of Truth**: For database entities, the schema becomes the authoritative source not just for structure, but also for lifecycle behavior.
4.  **Developer Experience**: Future developers can quickly grasp the intent and impact of models without navigating away from the core schema definition.

## Consequences

- **Documentation Maintainability**: Changes to model logic MUST be reflected in the schema comments immediately.
- **Verbose Schema File**: The `schema.prisma` file will be longer than usual, but the inline context significantly reduces cognitive load.
- **Standardized Implementation**: Repositories and Use Cases will follow a consistent pattern as documented in the schema, especially regarding soft-delete cascades and record restoration logic.
- **IntelliSense Integration**: By using triple-slash (`///`) Prisma comments, these notes can be propagated to the generated Prisma Client, providing context directly in IDE hovers.
