# Copilot Instructions: SIMCASI

This document provides a set of guidelines and standards for GitHub Copilot, ensuring that the generated code aligns with the established architecture and conventions in the Simcasi Fullstack project.

All code, text, and documentation must be in **English**, with the exception of error messages and logs.

## 1. Application Context

SIMCASI (Sistema de Monitoramento de Casos de Sífilis) is a clinical management system focused on tracking and managing syphilis-related medical data. It handles sensitive patient health information, including exams, treatments, and observations, and is subject to data privacy regulations such as the LGPD (Brazilian General Data Protection Law).

All generated code must reflect the sensitivity of this domain: avoid exposing patient data in logs, ensure all operations are audited, and apply strict access control through roles and permissions.

## 2. Backend Architecture

The backend follows the principles of **Clean Architecture** in a pragmatic way for TypeScript, combined with the **SOLID** principles. The directory structure in `core/` reflects this separation:

- **`core/domain`**: Contains the domain's entities, types, constants, and errors. It is the innermost layer and must not depend on any other.
- **`core/application`**: Contains the business logic, implemented through use cases. It orchestrates the data flow between the domain and the infrastructure.
- **`core/infrastructure`**: Contains concrete implementations of repositories, external providers, and library configurations (like Prisma).

### Principles to Follow:

- **SOLID**:
  - **S**ingle Responsibility Principle: Each class or function must have a single responsibility. Use cases should be focused on a single business operation.
  - **O**pen/Closed Principle: Entities and use cases should be open for extension but closed for modification. Use dependency injection and contracts (interfaces) to allow for the swapping of implementations.
  - **L**iskov Substitution Principle: Repository and provider implementations must be substitutable for their abstractions (contracts) without breaking the application.
  - **I**nterface Segregation Principle: Create specific interfaces (contracts in `core/application/contracts`) for the needs of the clients (use cases).
  - **D**ependency Inversion Principle: Depend on abstractions, not on implementations. Use cases must depend on repository contracts, not on concrete Prisma implementations.

- **ORM**: We use **Prisma** for database access. The schema is in `prisma/schema.prisma`. Repository implementations using Prisma are in `core/infrastructure/repositories`.

- **Validation**: Input data validation must be done in the application layer, preferably at the beginning of use cases, using Zod to define validation schemas.

- **Asynchronous Context (`AsyncLocalStorage`)**: We use `AsyncLocalStorage` from Node.js `async_hooks` (`core/infrastructure/lib/request-context.ts`) to propagate request-scoped metadata (e.g., `userId`, `roleId`, `ipAddress`, `userAgent`) across the entire asynchronous execution tree without prop-drilling. This context is populated at the entry points (Server Actions via `withSecuredActionAndAutomaticRetry`, API routes via `withAuthentication`) and consumed by repositories and use cases for authorization and audit logging. Unit tests for use cases that depend on this context must wrap their execution in a `requestContextStore.run()` block.

## 3. Frontend Architecture

The frontend is built with **Next.js (App Router)** and **React**.

### Component Structure:

- **`app/components/ui`**: Third-party UI components, currently from **Shadcn**. These components form the basis of our Design System and should not contain business logic.
- **`app/components/common`**: Components that are used in various parts of the application but may have slightly more context than the `ui` components.
- **`app/components/features`**: Components that implement a specific functionality and are composed of `ui` and `common` components (e.g., `PatientForm`, `ExamList`).
- **`app/components/layout`**: Components responsible for the visual structure of the page (e.g., `Header`, `Sidebar`, `Footer`).

### State Management:

- We use **Redux Toolkit** for global state management. The `slices` and the `store` are located in `stores/`.
- For local component state, use React hooks (`useState`, `useReducer`).

### Hooks:

- Create custom hooks in `hooks/` to encapsulate and reuse logic, such as API calls, complex state manipulation, or context access (e.g., `useUser`, `usePermission`).

### Server Actions:

- For all data operations (CRUD - Create, Read, Update, Delete), use **Server Actions**, located in `app/actions/`. They must call the use cases from the backend's application layer.

## 4. General Conventions

- **Clean Code and DRY (Don't Repeat Yourself)**: Write clean, readable code and avoid duplication. Functions should be small and focused.
- **Documentation**: Follow the **Google Style Guide** for documenting functions and classes, explaining their purpose, parameters, and return values.
- **Testing**:
  - Backend unit tests for use cases must have the `.test.ts` suffix.
  - Frontend tests must have the `.spec.tsx` suffix.
  - Write tests for Server Actions.
  - In the frontend, prioritize tests for critical components and hooks.
- **Naming**:
  - Interfaces/Types: Use `PascalCase` with the `Props` suffix for React component properties (e.g., `MyComponentProps`). For contracts, use `PascalCase` with the corresponding suffix (e.g., `IUserRepository`).
  - Functions/Variables: Use `camelCase`.
- **Formatting**: Follow the rules defined in `eslint.config.mjs` and `prettier`.

## 5. Code Generation and Development Workflow

1.  **Generate Code**: Ask Copilot to generate a function, component, use case, etc.
2.  **Review and Refactor**: **Always** review the generated code.
3.  **Check for Compliance**: Ensure the generated code follows the guidelines in this document (architecture, naming conventions, etc.).
4.  **Verify Tests**: When implementing any interaction or change, always check if the tests are passing correctly and fix them if they have broken.
5.  **Update Documentation**: When implementing new code or refactoring existing code, always check if the documentation remains accurate and follows the defined standards.
6.  **Check API Docs**: When modifying a backend feature that alters the properties of an entity, check if the OpenAPI documentation needs to be updated and, if so, update it.
7.  **Adjust as Needed**: Make the necessary adjustments to align the code with the project's standards before committing.
