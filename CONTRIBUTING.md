# Contributing

Thank you for your interest in contributing to SIMCASI. This guide covers everything you need to maintain code quality and consistency.

## Code Standards

- Follow **Clean Architecture** principles — see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Use **intent-revealing names** that express business meaning, not implementation details
- Follow **dot notation** for files: `name.type.ts` (e.g., `user.prisma.repository.ts`, `exam.actions.ts`)
- Write comments accessible to junior developers
- Use **Zod schemas** for all validation, especially in forms and Server Actions

## Working with the API

When adding or modifying API endpoints:

1. **Update OpenAPI Specification** — Modify the corresponding YAML file in `docs/openapi/`. Follow the existing structure and include descriptions, parameters, and examples.
2. **Add Comprehensive Examples** — Document request/response examples for both success and error cases with realistic data and proper status codes.
3. **Regenerate Documentation** — Run `pnpm docs:generate` to bundle and rebuild the Postman collection. Verify changes in Scalar UI at `http://localhost:3000/api/docs`.

## Code Quality

Before submitting a PR, ensure:

- `pnpm lint` passes without errors
- `pnpm test` passes across all projects (client, server, api-actions)
- TypeScript compilation succeeds (`pnpm build`)

## Development Workflow

This project follows **[GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow)**:

- `main` is always production-ready
- Create short-lived feature branches (`feature/*`, `bugfix/*`, etc.)
- Open a pull request — all CI checks must pass before merging
- Delete the branch after merge

## Commit Conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

feat(patients): add bulk import endpoint
fix(auth): handle expired token edge case
docs: update API examples for exam endpoints
```

## Continuous Integration

Every push and pull request runs an automated pipeline that checks:

| Check               | Command                                     |
| ------------------- | ------------------------------------------- |
| Linting             | `pnpm lint`                                 |
| Tests (client)      | `pnpm test -- --selectProjects=client`      |
| Tests (server)      | `pnpm test -- --selectProjects=server`      |
| Tests (api-actions) | `pnpm test -- --selectProjects=api-actions` |
| Build               | `pnpm build`                                |

All checks must pass before a PR can be merged to `main`. View results in the **Actions** tab on GitHub. Configuration: [.github/workflows/ci.yml](.github/workflows/ci.yml).
