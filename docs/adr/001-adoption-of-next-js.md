# ADR 001: Adoption of Next.js

- **Status:** Accepted
- **Date:** 2025-11-21
- **Deciders:** Thiago Luiz da Cruz Souza

## Context

The SIMCASI project requires a modern, scalable, and full-stack web framework to handle clinical monitoring, administrative dashboards, and secure authentication. The goal is to build a robust system that is easy to maintain and has a strong pool of talent for future support.

## Decision

We have decided to use **Next.js** (App Router) as the primary framework for the application.

## Rationale

1.  **Unified Full-Stack Environment**: Next.js allows us to manage both the frontend and the backend (API Routes, Server Actions) within a single codebase, simplifying deployment and sharing of contracts/validation logic.
2.  **React Ecosystem**: Being built on top of React, it leverages the most popular frontend library in the world. This ensures long-term support and makes it significantly easier to find qualified professionals for maintenance.
3.  **App Router Features**: Capabilities like Server Components (RSC) allow us to fetch data closer to the database, reducing client-side bundle size and improving performance.
4.  **Integrated Tooling**: Built-in support for TypeScript, ESLint, and PostCSS provides a developer-friendly experience out of the box.
5.  **SEO and SSR**: Native Server-Side Rendering (SSR) and Static Site Generation (SSG) provide flexibility for public pages and optimized loading states for the private dashboard.

## Consequences

- **Fast Performance**: Achieved through server-side pre-rendering and efficient code splitting.
- **Improved Security**: Server Actions and API Routes allow sensitive logic (like token signing and DB queries) to stay strictly on the server.
- **Developer Productivity**: Features like Fast Refresh and comprehensive documentation accelerate the development cycle.
- **Opinionated Structure**: The file-based routing and App Router patterns enforce a specific workflow that can be more restrictive than custom setups.
- **Learning Curve**: Requires effort to master the boundaries between Server and Client Components.
- **Framework Complexity**: Adds an abstraction layer over standard React and Node.js that must be managed.
