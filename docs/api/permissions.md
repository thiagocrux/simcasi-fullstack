# Permissions

_Granular control over specific technical system capabilities._

## `GET` Find permissions

Retrieves all technical capabilities mapped in the ecosystem.

### **Endpoint**

```
/api/permissions
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
curl -X GET "{{baseUrl}}/api/permissions?page=1&limit=20&search=READ_PATIENT&includeDeleted=false" \
  -H "Authorization: Bearer {{accessToken}}"
```

### **Response Body**

| Name  | Type                 | Description                 |
| :---- | :------------------- | :-------------------------- |
| items | permission[] \| null | List of permission objects. |
| total | number \| null       | Total count of permissions. |

**_Example:_**

```json
{
  "items": [
    {
      "id": "uuid-1",
      "code": "read:patient",
      "createdAt": "2026-01-18T10:00:00Z",
      "updatedAt": null,
      "deletedAt": null
    },
    {
      "id": "uuid-2",
      "code": "write:treatment",
      "createdAt": "2026-01-18T10:00:00Z",
      "updatedAt": null,
      "deletedAt": null
    }
  ],
  "total": 2
}
```

## `POST` Register a permission

Declares a new system capability.

### **Endpoint**

```
/api/permissions
```

**_Example:_**

```bash
curl -X POST "{{baseUrl}}/api/permissions" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "delete:audit_log",
    "roleIds": ["admin-role-uuid"],
    "ipAddress": "127.0.0.1",
    "userAgent": "Node/v20"
  }'
```

### **Request Body**

| Name      | Type             | Mandatory | Description                                                                                               |
| :-------- | :--------------- | :-------- | :-------------------------------------------------------------------------------------------------------- |
| code      | string \| null   | Yes       | Unique identifier code for the permission (e.g., READ_PATIENT, WRITE_EXAM).                               |
| roleIds   | string[] \| null | No        | List of permission identifiers to be linked to this permission.                                           |
| ipAddress | string \| null   | Yes       | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent | string \| null   | Yes       | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |

**_Example:_**

```json
{
  "id": "uuid-123",
  "code": "delete:audit_log",
  "roleIds": ["admin-role-uuid"],
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": null,
  "deletedAt": null,
  "ipAddress": "127.0.0.1",
  "userAgent": "Mozilla/5.0"
}
```

### **Response Body**

| Name      | Type           | Description                                                               |
| :-------- | :------------- | :------------------------------------------------------------------------ |
| id        | string \| null | Technical identifier (UUID v4).                                           |
| code      | string \| null | Unique identifier code for the permission.                                |
| createdAt | string \| null | Date and time (ISO 8601) when the record was created.                     |
| updatedAt | string \| null | Date and time (ISO 8601) when the record was last updated.                |
| deletedAt | string \| null | Date and time (ISO 8601) when the record was soft-deleted, if applicable. |

**_Example:_**

```json
{
  "id": "uuid-123",
  "code": "delete:audit_log",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": null,
  "deletedAt": null
}
```

## `GET` Get a permission

Accesses the technical code and metadata for a specific granular system capability.

### **Endpoint**

```
/api/permissions/:id
```

### **URL Params**

| Name | Type   | Description                           |
| :--- | :----- | :------------------------------------ |
| id   | string | Unique identifier for the permission. |

**_Example:_**

```bash
curl -X GET "{{baseUrl}}/api/permissions/uuid-1" \
  -H "Authorization: Bearer {{accessToken}}"
```

### **Response Body**

| Name      | Type           | Description                                                               |
| :-------- | :------------- | :------------------------------------------------------------------------ |
| id        | string \| null | Technical identifier (UUID v4).                                           |
| code      | string \| null | Unique identifier code for the permission.                                |
| createdAt | string \| null | Date and time (ISO 8601) when the record was created.                     |
| updatedAt | string \| null | Date and time (ISO 8601) when the record was last updated.                |
| deletedAt | string \| null | Date and time (ISO 8601) when the record was soft-deleted, if applicable. |

**_Example:_**

```json
{
  "id": "uuid-1",
  "code": "read:patient",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": null,
  "deletedAt": null
}
```

## `PATCH` Update a permission

Changes the identifier or role attachments.

### **Endpoint**

```
/api/permissions/:id
```

### **URL Params**

| Name | Type   | Description                           |
| :--- | :----- | :------------------------------------ |
| id   | string | Unique identifier for the permission. |

**_Example:_**

```bash
curl -X PATCH "{{baseUrl}}/api/permissions/uuid-1" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "read:patient:sensitive",
    "ipAddress": "127.0.0.1",
    "userAgent": "Node/v20"
  }'
```

### **Request Body**

| Name      | Type             | Mandatory | Description                                                                                               |
| :-------- | :--------------- | :-------- | :-------------------------------------------------------------------------------------------------------- |
| code      | string \| null   | No        | Unique identifier code for the permission (e.g., READ_PATIENT, WRITE_EXAM).                               |
| roleIds   | string[] \| null | No        | List of permission identifiers to be linked to this permission.                                           |
| ipAddress | string \| null   | Yes       | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent | string \| null   | Yes       | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |

**_Example:_**

```json
{
  "id": "uuid-1",
  "code": "read:patient:sensitive",
  "roleIds": ["admin-role-uuid"],
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": "2026-01-18T11:00:00Z",
  "deletedAt": null,
  "ipAddress": "127.0.0.1",
  "userAgent": "Mozilla/5.0"
}
```

### **Response Body**

| Name      | Type           | Description                                                               |
| :-------- | :------------- | :------------------------------------------------------------------------ |
| id        | string \| null | Technical identifier (UUID v4).                                           |
| code      | string \| null | Unique identifier code for the permission.                                |
| createdAt | string \| null | Date and time (ISO 8601) when the record was created.                     |
| updatedAt | string \| null | Date and time (ISO 8601) when the record was last updated.                |
| deletedAt | string \| null | Date and time (ISO 8601) when the record was soft-deleted, if applicable. |

**_Example:_**

```json
{
  "id": "uuid-1",
  "code": "read:patient:sensitive",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": "2026-01-18T11:00:00Z",
  "deletedAt": null
}
```

## `DELETE` Delete a permission

Removes a technical capability from active use via soft-deletion, while preserving its historical linkage to roles.

### **Endpoint**

```
/api/permissions/:id
```

### **URL Params**

| Name | Type   | Description                           |
| :--- | :----- | :------------------------------------ |
| id   | string | Unique identifier for the permission. |

**_Example:_**

```bash
curl -X DELETE "{{baseUrl}}/api/permissions/uuid-1" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "ipAddress": "127.0.0.1",
    "userAgent": "Postman"
  }'
```

### **Request Body**

| Name      | Type           | Mandatory | Description                                                                                               |
| :-------- | :------------- | :-------- | :-------------------------------------------------------------------------------------------------------- |
| ipAddress | string \| null | Yes       | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent | string \| null | Yes       | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |

### **Response Body**

_Returns 204 No Content on success._

## `PATCH` Restore a permission

Reinstates a soft-deleted system capability into the active permissions pool.

### **Endpoint**

```
/api/permissions/:id/restore
```

### **URL Params**

| Name | Type   | Description                           |
| :--- | :----- | :------------------------------------ |
| id   | string | Unique identifier for the permission. |

**_Example:_**

```bash
curl -X PATCH "{{baseUrl}}/api/permissions/uuid-1/restore" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "ipAddress": "127.0.0.1",
    "userAgent": "Postman"
  }'
```

### **Request Body**

| Name      | Type           | Mandatory | Description                                                                                               |
| :-------- | :------------- | :-------- | :-------------------------------------------------------------------------------------------------------- |
| ipAddress | string \| null | Yes       | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent | string \| null | Yes       | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |

### **Response Body**

| Name      | Type           | Description                                                               |
| :-------- | :------------- | :------------------------------------------------------------------------ |
| id        | string \| null | Technical identifier (UUID v4).                                           |
| code      | string \| null | Unique identifier code for the permission.                                |
| createdAt | string \| null | Date and time (ISO 8601) when the record was created.                     |
| updatedAt | string \| null | Date and time (ISO 8601) when the record was last updated.                |
| deletedAt | string \| null | Date and time (ISO 8601) when the record was soft-deleted, if applicable. |

**_Example:_**

```json
{
  "id": "uuid-1",
  "code": "read:patient:sensitive",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": "2026-01-18T12:00:00Z",
  "deletedAt": null
}
```
