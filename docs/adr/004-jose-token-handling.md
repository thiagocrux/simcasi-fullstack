# ADR 004: Choice of jose for Token Handling

- **Status:** Accepted
- **Date:** 2026-01-14
- **Deciders:** Thiago Luiz da Cruz Souza

## Context

The system requires a robust and secure way to handle JSON Web Tokens (JWT) for authentication and authorization. Given that the project uses Next.js (App Router) and may run in serverless environments or utilize Middleware (Edge Runtime), the selected library must be compatible with both Node.js and Web standard APIs.

## Decision

We have decided to use **`jose`** as the primary library for JWT operations (signing, verification, and encryption).

## Rationale

1.  **Universal Compatibility**: Unlike `jsonwebtoken`, which depends on Node.js built-in modules like `crypto`, `jose` is built using Web Cryptography APIs. This makes it fully compatible with Next.js Middleware and Edge Runtime.
2.  **Zero Dependencies**: It has no external dependencies, reducing the bundle size and minimizing the attack surface.
3.  **Active Maintenance**: It is a modern, performance-oriented library that stays updated with the latest JWA/JWS/JWE specifications.
4.  **Security**: It provides strong defaults and a clean API that discourages insecure practices (like using `none` algorithms).

## Consequences

- **Performance**: Improved cold start times in serverless environments due to the lightweight nature of the library.
- **Learning Curve**: The API differs slightly from the legacy `jsonwebtoken` (e.g., usage of `Uint8Array` for keys), which may require a small adjustment for developers accustomed to the older library.
- **Portability**: The authentication logic in `core/infrastructure/providers/token.jose.provider.ts` can be reused in any JavaScript environment without modification.
