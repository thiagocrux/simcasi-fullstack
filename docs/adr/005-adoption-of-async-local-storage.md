# ADR 005: Adoption of AsyncLocalStorage for Request Context

- **Status:** Accepted
- **Date:** 2026-02-12
- **Deciders:** Thiago Luiz da Cruz Souza

## Context

In the SIMCASI project, we follow a Clean Architecture approach where business logic is encapsulated in Use Cases. Many operations—especially updates and sensitive clinical actions—require metadata such as the executing `userId`, `roleId`, `ipAddress`, and `userAgent` for authorization and audit logging.

Passing these infrastructure-related details as explicit arguments through every layer (Server Actions/APIs -> Use Cases -> Repositories) leads to "prop drilling." This pollutes the business contracts, makes the code harder to maintain, and increases the risk of omitting metadata in log entries.

## Decision

We have decided to use **`AsyncLocalStorage` (ALS)** from the Node.js `async_hooks` module to manage a centralized, request-scoped context.

## Rationale

1.  **Cleaner Domain Contracts**: Use Case inputs remain focused strictly on business data (e.g., patient name, exam results) rather than infrastructure metadata.
2.  **Centralized Auditing**: Repositories and Use Cases can retrieve the executor's identity and request origin (IP/UA) directly from the context, ensuring consistent audit logs across the entire system.
3.  **Unified Entry Points**: By wrapping both Server Actions (via `withSecuredActionAndAutomaticRetry`) and API Routes (via `withAuthentication`) with the ALS provider, we ensure that the context is populated regardless of the request source.
4.  **Security and Isolation**: Since ALS is scoped to the asynchronous execution promise, there is no risk of context leakage between concurrent requests, which is critical for a multi-user clinical system.
5.  **Reduced Human Error**: Developers no longer need to remember to pass the `userId` into five different function calls; the data is "magically" available in the execution tree.

## Consequences

- **Improved DX**: Developers can fetch the current user or IP address anywhere in the logic without modifying method signatures.
- **Implicit State awareness**: New developers must be aware that certain data is retrieved from a global context store rather than explicit arguments.
- **Testability**: Unit tests for Use Cases now require wrapping the execution in a `requestContextStore.run()` block to simulate the request environment.
- **Node.js Dependency**: This solution relies on Node.js core modules, which is acceptable since the project is deployed in a Node.js environment (Next.js Server).
- **Maintenance**: The context provider must be strictly maintained to ensure falling back gracefully if the context is accessed outside of a request scope.
