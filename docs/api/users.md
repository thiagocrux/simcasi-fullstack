# Users

_Administration of healthcare professionals and administrators._

## `GET` Find users

Retrieves a paginated list of users with optional filtering by name or email, including soft-deleted accounts if requested.

### **Endpoint**

```
/api/users
```

### **Query Params**

| Name           | Type    | Mandatory | Description                                          |
| :------------- | :------ | :-------- | :--------------------------------------------------- |
| page           | number  | No        | Results page numbering.                              |
| limit          | number  | No        | Items per results page.                              |
| search         | string  | No        | Filter search string for relevant record fields.     |
| includeDeleted | boolean | No        | Flag to include soft-deleted records in the results. |

**_Example:_**

```bash
curl -X GET "{{baseUrl}}/api/users?page=1&limit=10&search=João&includeDeleted=false" \
  -H "Authorization: Bearer {{accessToken}}"
```

### **Response Body**

| Name  | Type           | Description                                        |
| :---- | :------------- | :------------------------------------------------- |
| items | user[] \| null | Array of user profile objects.                     |
| total | number \| null | Total count of users matching the filter criteria. |

**_Example:_**

```json
{
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Thiago Silva",
      "email": "dr.thiago@simcasi.gov.br",
      "roleId": "8db3d722-6e2a-11ee-8c99-0242ac120002",
      "createdAt": "2026-01-18T10:00:00Z",
      "updatedAt": null,
      "deletedAt": null
    }
  ],
  "total": 1
}
```

## `POST` Register a user

Persists a new user record with credentials and links it to a specific RBAC role.

### **Endpoint**

```
/api/users
```

**_Example:_**

```bash
curl -X POST "{{baseUrl}}/api/users" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Oliveira",
    "email": "maria.enfa@simcasi.gov.br",
    "password": "SafetyFirst#2026",
    "roleId": "8db3d722-6e2a-11ee-8c99-0242ac120002",
    "ipAddress": "189.120.45.3",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
  }'
```

### **Request Body**

| Name      | Type           | Mandatory | Description                                                                                               |
| :-------- | :------------- | :-------- | :-------------------------------------------------------------------------------------------------------- |
| name      | string \| null | Yes       | User's full name.                                                                                         |
| email     | string \| null | Yes       | User's unique electronic mail address.                                                                    |
| password  | string \| null | Yes       | Secret authentication string (hashed in storage).                                                         |
| roleId    | string \| null | Yes       | Unique identifier for the assigned system role.                                                           |
| ipAddress | string \| null | Yes       | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent | string \| null | Yes       | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |

**_Example:_**

```json
{
  "id": "77a83d44-6e2b-41ee-8c99-0242ac120003",
  "name": "Maria Oliveira",
  "email": "maria.enfa@simcasi.gov.br",
  "password": "SafetyFirst#2026",
  "roleId": "8db3d722-6e2a-11ee-8c99-0242ac120002",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": null,
  "deletedAt": null,
  "ipAddress": "127.0.0.1",
  "userAgent": "Mozilla/5.0"
}
```

### **Response Body**

| Name      | Type           | Description                                     |
| :-------- | :------------- | :---------------------------------------------- |
| id        | string \| null | Unique identifier for the record.               |
| name      | string \| null | User's full name.                               |
| email     | string \| null | User's unique electronic mail address.          |
| roleId    | string \| null | Unique identifier for the assigned system role. |
| createdAt | date \| null   | Timestamp of record creation.                   |
| updatedAt | date \| null   | Timestamp of the last update.                   |
| deletedAt | date \| null   | Timestamp of soft-deletion, if applicable.      |

**_Example:_**

```json
{
  "id": "77a83d44-6e2b-41ee-8c99-0242ac120003",
  "name": "Maria Oliveira",
  "email": "maria.enfa@simcasi.gov.br",
  "roleId": "8db3d722-6e2a-11ee-8c99-0242ac120002",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": null,
  "deletedAt": null
}
```

## `GET` Get a user

Fetches complete profile data and metadata for a single user record identified by its UUID.

### **Endpoint**

```
/api/users/:id
```

### **URL Params**

| Name | Type   | Description                     |
| :--- | :----- | :------------------------------ |
| id   | string | Unique identifier for the user. |

**_Example:_**

```bash
curl -X GET "{{baseUrl}}/api/users/77a83d44-6e2b-41ee-8c99-0242ac120003" \
  -H "Authorization: Bearer {{accessToken}}"
```

### **Response Body**

| Name      | Type           | Description                                     |
| :-------- | :------------- | :---------------------------------------------- |
| id        | string \| null | Unique identifier for the record.               |
| name      | string \| null | User's full name.                               |
| email     | string \| null | User's unique electronic mail address.          |
| roleId    | string \| null | Unique identifier for the assigned system role. |
| createdAt | date \| null   | Timestamp of record creation.                   |
| updatedAt | date \| null   | Timestamp of the last update.                   |
| deletedAt | date \| null   | Timestamp of soft-deletion, if applicable.      |

**_Example:_**

```json
{
  "id": "77a83d44-6e2b-41ee-8c99-0242ac120003",
  "name": "Maria Oliveira",
  "email": "maria.enfa@simcasi.gov.br",
  "roleId": "8db3d722-6e2a-11ee-8c99-0242ac120002",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": null,
  "deletedAt": null
}
```

## `PATCH` Update a user

Applies partial updates to a user's record (e.g., name, email, or role) while preserving unchanged fields.

### **Endpoint**

```
/api/users/:id
```

### **URL Params**

| Name | Type   | Description                     |
| :--- | :----- | :------------------------------ |
| id   | string | Unique identifier for the user. |

**_Example:_**

```bash
curl -X PATCH "{{baseUrl}}/api/users/77a83d44-6e2b-41ee-8c99-0242ac120003" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Oliveira Santos",
    "ipAddress": "189.120.45.3",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
  }'
```

### **Request Body**

| Name      | Type           | Mandatory | Description                                                                                               |
| :-------- | :------------- | :-------- | :-------------------------------------------------------------------------------------------------------- |
| name      | string \| null | No        | User's full name.                                                                                         |
| email     | string \| null | No        | User's unique electronic mail address.                                                                    |
| roleId    | string \| null | No        | Unique identifier for the assigned system role.                                                           |
| ipAddress | string \| null | Yes       | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent | string \| null | Yes       | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |

**_Example:_**

```json
{
  "id": "77a83d44-6e2b-41ee-8c99-0242ac120003",
  "name": "Maria Oliveira Santos",
  "email": "maria.enfa@simcasi.gov.br",
  "roleId": "8db3d722-6e2a-11ee-8c99-0242ac120002",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": "2026-01-18T11:00:00Z",
  "deletedAt": null,
  "ipAddress": "127.0.0.1",
  "userAgent": "Mozilla/5.0"
}
```

### **Response Body**

| Name      | Type           | Description                                     |
| :-------- | :------------- | :---------------------------------------------- |
| id        | string \| null | Unique identifier for the record.               |
| name      | string \| null | User's full name.                               |
| email     | string \| null | User's unique electronic mail address.          |
| roleId    | string \| null | Unique identifier for the assigned system role. |
| createdAt | date \| null   | Timestamp of record creation.                   |
| updatedAt | date \| null   | Timestamp of the last update.                   |
| deletedAt | date \| null   | Timestamp of soft-deletion, if applicable.      |

**_Example:_**

```json
{
  "id": "77a83d44-6e2b-41ee-8c99-0242ac120003",
  "name": "Maria Oliveira Santos",
  "email": "maria.enfa@simcasi.gov.br",
  "roleId": "8db3d722-6e2a-11ee-8c99-0242ac120002",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": "2026-01-18T11:00:00Z",
  "deletedAt": null
}
```

## `DELETE` Delete a user

Marks a user record as inactive using a soft-deletion pattern, preventing future system access without purging data.

### **Endpoint**

```
/api/users/:id
```

### **URL Params**

| Name | Type   | Description                     |
| :--- | :----- | :------------------------------ |
| id   | string | Unique identifier for the user. |

**_Example:_**

```bash
curl -X DELETE "{{baseUrl}}/api/users/77a83d44-6e2b-41ee-8c99-0242ac120003" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "ipAddress": "189.120.45.3",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
  }'
```

### **Request Body**

| Name      | Type           | Mandatory | Description                                                                                               |
| :-------- | :------------- | :-------- | :-------------------------------------------------------------------------------------------------------- |
| ipAddress | string \| null | Yes       | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent | string \| null | Yes       | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |

**_Example:_**

```json
{
  "ipAddress": "127.0.0.1",
  "userAgent": "Mozilla/5.0"
}
```

### **Response Body**

_Returns 204 No Content on success._

## `PATCH` Restore a user

Removes the soft-deletion flag from a user record, restoring system access and profile visibility.

### **Endpoint**

```
/api/users/:id/restore
```

### **URL Params**

| Name | Type   | Description                     |
| :--- | :----- | :------------------------------ |
| id   | string | Unique identifier for the user. |

**_Example:_**

```bash
curl -X PATCH "{{baseUrl}}/api/users/77a83d44-6e2b-41ee-8c99-0242ac120003/restore" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "ipAddress": "189.120.45.3",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
  }'
```

### **Request Body**

| Name      | Type           | Mandatory | Description                                                                                               |
| :-------- | :------------- | :-------- | :-------------------------------------------------------------------------------------------------------- |
| ipAddress | string \| null | Yes       | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent | string \| null | Yes       | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |

**_Example:_**

```json
{
  "ipAddress": "127.0.0.1",
  "userAgent": "Mozilla/5.0"
}
```

### **Response Body**

| Name      | Type           | Description                                     |
| :-------- | :------------- | :---------------------------------------------- |
| id        | string \| null | Unique identifier for the record.               |
| name      | string \| null | User's full name.                               |
| email     | string \| null | User's unique electronic mail address.          |
| roleId    | string \| null | Unique identifier for the assigned system role. |
| createdAt | date \| null   | Timestamp of record creation.                   |
| updatedAt | date \| null   | Timestamp of the last update.                   |
| deletedAt | date \| null   | Timestamp of soft-deletion, if applicable.      |

**_Example:_**

```json
{
  "id": "77a83d44-6e2b-41ee-8c99-0242ac120003",
  "name": "Maria Oliveira Santos",
  "email": "maria.enfa@simcasi.gov.br",
  "roleId": "8db3d722-6e2a-11ee-8c99-0242ac120002",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": "2026-01-18T12:00:00Z",
  "deletedAt": null
}
```
