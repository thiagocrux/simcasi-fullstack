# Auth

_Lifecycle management for security tokens and active sessions._

## `POST` Login

Authenticates users by email/password, creates a secure stateful session, and returns a JWT token pair (Access/Refresh).

### **Endpoint**

```
/api/auth/login
```

**_Example:_**

```bash
curl -X POST "{{baseUrl}}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dr.thiago@simcasi.gov.br",
    "password": "StrongPassword#2026",
    "ipAddress": "127.0.0.1",
    "userAgent": "Mozilla/5.0"
  }'
```

### **Request Body**

| Name      | Type           | Mandatory | Description                                                                                               |
| :-------- | :------------- | :-------- | :-------------------------------------------------------------------------------------------------------- |
| email     | string \| null | Yes       | User's unique electronic mail address.                                                                    |
| password  | string \| null | Yes       | Secret authentication string (hashed in storage).                                                         |
| ipAddress | string \| null | Yes       | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent | string \| null | Yes       | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |

**_Example:_**

```json
{
  "email": "dr.thiago@simcasi.gov.br",
  "password": "StrongPassword#2026",
  "ipAddress": "189.120.45.2",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}
```

### **Response Body**

| Name         | Type           | Description                                        |
| :----------- | :------------- | :------------------------------------------------- |
| accessToken  | string \| null | Short-lived JWT used for authenticated requests.   |
| refreshToken | string \| null | Long-lived token used to obtain new access tokens. |
| user         | object \| null | Object containing basic user profile information.  |

**_Example:_**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Thiago Silva",
    "email": "dr.thiago@simcasi.gov.br",
    "roleId": "8db3d722-6e2a-11ee-8c99-0242ac120002"
  }
}
```

## `POST` Refresh token

Performs token rotation by validating an active refresh token and issuing a new pair, extending the session lifecycle.

### **Endpoint**

```
/api/auth/refresh
```

**_Example:_**

```bash
curl -X POST "{{baseUrl}}/api/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "ipAddress": "127.0.0.1",
    "userAgent": "Mozilla/5.0"
  }'
```

### **Request Body**

| Name         | Type           | Mandatory | Description                                                                                               |
| :----------- | :------------- | :-------- | :-------------------------------------------------------------------------------------------------------- |
| refreshToken | string \| null | Yes       | Long-lived token used to obtain new access tokens.                                                        |
| ipAddress    | string \| null | Yes       | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent    | string \| null | Yes       | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |

**_Example:_**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "ipAddress": "189.120.45.2",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}
```

### **Response Body**

| Name         | Type           | Description                                        |
| :----------- | :------------- | :------------------------------------------------- |
| accessToken  | string \| null | Short-lived JWT used for authenticated requests.   |
| refreshToken | string \| null | Long-lived token used to obtain new access tokens. |
| user         | object \| null | Object containing basic user profile information.  |

**_Example:_**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.new",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.new",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Thiago Silva",
    "email": "dr.thiago@simcasi.gov.br",
    "roleId": "8db3d722-6e2a-11ee-8c99-0242ac120002"
  }
}
```

## `POST` Logout

Terminates the active session by revoking the refresh token state, effectively invalidating future refresh attempts.

### **Endpoint**

```
/api/auth/logout
```

**_Example:_**

```bash
curl -X POST "{{baseUrl}}/api/auth/logout" \
  -H "Authorization: Bearer {{accessToken}}"
```

### **Response Body**

_Returns 204 No Content on success._
