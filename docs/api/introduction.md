# SIMCASI API Reference

This document serves as the single source of truth for the **SIMCASI** (Sistema de Monitoramento de Casos de Sífilis) API.

## Getting Started

### Authentication and Tokens

Most API endpoints are protected and require a **Bearer Token**.

1. **Obtain Token**: Use the ` Login` endpoint to receive an `accessToken`.
2. **Usage**: Include the token in the `Authorization` header:
   ```http
   Authorization: Bearer <your_access_token>
   ```
3. **Expiration**: If you receive a `401 Unauthorized` response, use the ` Refresh token` endpoint.

## Additional Information

### Audit Metadata

Mutation endpoints (`POST`, `PATCH`, `DELETE`) require `ipAddress` and `userAgent` for governance and compliance. Read-only endpoints (`GET`) do not require these fields.
