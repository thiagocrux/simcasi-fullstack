# Roles

_Management of access profiles and permission sets._

## `GET` Find roles

Lists all functional access profiles available in the system.

### **Endpoint**

```
/api/roles
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
curl -X GET "{{baseUrl}}/api/roles?page=1&limit=10&search=ADMIN&includeDeleted=false" \
  -H "Authorization: Bearer {{accessToken}}"
```

### **Response Body**

| Name  | Type           | Description            |
| :---- | :------------- | :--------------------- |
| items | role[] \| null | Array of role objects. |
| total | number \| null | Total count of roles.  |

**_Example:_**

```json
{
  "items": [
    {
      "id": "8db3d722-6e2a-11ee-8c99-0242ac120002",
      "code": "admin",
      "createdAt": "2026-01-18T10:00:00Z",
      "updatedAt": null,
      "deletedAt": null
    },
    {
      "id": "a1b2c3d4-6e2a-11ee-8c99-0242ac120002",
      "code": "healthcare_pro",
      "createdAt": "2026-01-18T10:00:00Z",
      "updatedAt": null,
      "deletedAt": null
    }
  ],
  "total": 2
}
```

## `POST` Register a role

Defines a new profile and its initial set of permissions (Many-to-Many).

### **Endpoint**

```
/api/roles
```

**_Example:_**

```bash
curl -X POST "{{baseUrl}}/api/roles" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "nurse",
    "permissionIds": ["uuid-perm-1", "uuid-perm-2"],
    "ipAddress": "189.120.45.1",
    "userAgent": "Mozilla/5.0"
  }'
```

### **Request Body**

| Name          | Type             | Mandatory | Description                                                                                               |
| :------------ | :--------------- | :-------- | :-------------------------------------------------------------------------------------------------------- |
| code          | string \| null   | Yes       | Unique identifier code for the role (e.g., ADMIN, HEALTH_PROFESSIONAL).                                   |
| permissionIds | string[] \| null | No        | List of permission identifiers to be linked to this role.                                                 |
| ipAddress     | string \| null   | Yes       | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent     | string \| null   | Yes       | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |

**_Example:_**

```json
{
  "id": "8db3d722-6e2a-11ee-8c99-0242ac120002",
  "code": "nurse",
  "permissionIds": ["uuid-perm-1", "uuid-perm-2"],
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": null,
  "deletedAt": null,
  "ipAddress": "127.0.0.1",
  "userAgent": "Mozilla/5.0"
}
```

### **Response Body**

| Name      | Type           | Description                                                             |
| :-------- | :------------- | :---------------------------------------------------------------------- |
| id        | string \| null | Unique identifier for the record.                                       |
| code      | string \| null | Unique identifier code for the role (e.g., ADMIN, HEALTH_PROFESSIONAL). |
| createdAt | date \| null   | Timestamp of record creation.                                           |
| updatedAt | date \| null   | Timestamp of the last update.                                           |
| deletedAt | date \| null   | Timestamp of soft-deletion, if applicable.                              |

**_Example:_**

```json
{
  "id": "8db3d722-6e2a-11ee-8c99-0242ac120002",
  "code": "nurse",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": null,
  "deletedAt": null
}
```

## `GET` Get a role

Retrieves technical identifiers and current permission sets for a specific access profile.

### **Endpoint**

```
/api/roles/:id
```

### **URL Params**

| Name | Type   | Description                     |
| :--- | :----- | :------------------------------ |
| id   | string | Unique identifier for the role. |

**_Example:_**

```bash
curl -X GET "{{baseUrl}}/api/roles/8db3d722-6e2a-11ee-8c99-0242ac120002" \
  -H "Authorization: Bearer {{accessToken}}"
```

### **Response Body**

| Name      | Type           | Description                                                             |
| :-------- | :------------- | :---------------------------------------------------------------------- |
| id        | string \| null | Unique identifier for the record.                                       |
| code      | string \| null | Unique identifier code for the role (e.g., ADMIN, HEALTH_PROFESSIONAL). |
| createdAt | date \| null   | Timestamp of record creation.                                           |
| updatedAt | date \| null   | Timestamp of the last update.                                           |
| deletedAt | date \| null   | Timestamp of soft-deletion, if applicable.                              |

**_Example:_**

```json
{
  "id": "8db3d722-6e2a-11ee-8c99-0242ac120002",
  "code": "admin",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": null,
  "deletedAt": null
}
```

## `PATCH` Update a role

Changes the identifier or synchronized permissions of a role.

### **Endpoint**

```
/api/roles/:id
```

### **URL Params**

| Name | Type   | Description                     |
| :--- | :----- | :------------------------------ |
| id   | string | Unique identifier for the role. |

**_Example:_**

```bash
curl -X PATCH "{{baseUrl}}/api/roles/8db3d722-6e2a-11ee-8c99-0242ac120002" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "permissionIds": ["uuid-perm-1", "uuid-perm-3"],
    "ipAddress": "189.120.45.1",
    "userAgent": "Mozilla/5.0"
  }'
```

### **Request Body**

| Name          | Type             | Mandatory | Description                                                                                               |
| :------------ | :--------------- | :-------- | :-------------------------------------------------------------------------------------------------------- |
| code          | string \| null   | No        | Unique identifier code for the role (e.g., ADMIN, HEALTH_PROFESSIONAL).                                   |
| permissionIds | string[] \| null | No        | List of permission identifiers to be linked to this role.                                                 |
| ipAddress     | string \| null   | Yes       | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent     | string \| null   | Yes       | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |

**_Example:_**

```json
{
  "id": "8db3d722-6e2a-11ee-8c99-0242ac120002",
  "code": "admin",
  "permissionIds": ["uuid-perm-1", "uuid-perm-3"],
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": "2026-01-18T11:00:00Z",
  "deletedAt": null,
  "ipAddress": "189.120.45.1",
  "userAgent": "Mozilla/5.0"
}
```

### **Response Body**

| Name      | Type           | Description                                                             |
| :-------- | :------------- | :---------------------------------------------------------------------- |
| id        | string \| null | Unique identifier for the record.                                       |
| code      | string \| null | Unique identifier code for the role (e.g., ADMIN, HEALTH_PROFESSIONAL). |
| createdAt | date \| null   | Timestamp of record creation.                                           |
| updatedAt | date \| null   | Timestamp of the last update.                                           |
| deletedAt | date \| null   | Timestamp of soft-deletion, if applicable.                              |

**_Example:_**

```json
{
  "id": "8db3d722-6e2a-11ee-8c99-0242ac120002",
  "code": "admin",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": "2026-01-18T11:00:00Z",
  "deletedAt": null
}
```

## `DELETE` Delete a role

Deactivates an access profile via soft-deletion, preventing its assignment to users while maintaining history.

### **Endpoint**

```
/api/roles/:id
```

### **URL Params**

| Name | Type   | Description                     |
| :--- | :----- | :------------------------------ |
| id   | string | Unique identifier for the role. |

**_Example:_**

```bash
curl -X DELETE "{{baseUrl}}/api/roles/8db3d722-6e2a-11ee-8c99-0242ac120002" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "ipAddress": "189.120.45.1",
    "userAgent": "Mozilla/5.0"
  }'
```

### **Request Body**

| Name      | Type           | Mandatory | Description                                                                                               |
| :-------- | :------------- | :-------- | :-------------------------------------------------------------------------------------------------------- |
| ipAddress | string \| null | Yes       | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent | string \| null | Yes       | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |

### **Response Body**

_Returns 204 No Content on success._

## `PATCH` Restore a role

Reinstates a soft-deleted access profile, allowing it to be assigned to users again.

### **Endpoint**

```
/api/roles/:id/restore
```

### **URL Params**

| Name | Type   | Description                     |
| :--- | :----- | :------------------------------ |
| id   | string | Unique identifier for the role. |

**_Example:_**

```bash
curl -X PATCH "{{baseUrl}}/api/roles/8db3d722-6e2a-11ee-8c99-0242ac120002/restore" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "ipAddress": "189.120.45.1",
    "userAgent": "Mozilla/5.0"
  }'
```

### **Request Body**

| Name      | Type           | Mandatory | Description                                                                                               |
| :-------- | :------------- | :-------- | :-------------------------------------------------------------------------------------------------------- |
| ipAddress | string \| null | Yes       | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent | string \| null | Yes       | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |

### **Response Body**

| Name      | Type           | Description                                                             |
| :-------- | :------------- | :---------------------------------------------------------------------- |
| id        | string \| null | Unique identifier for the record.                                       |
| code      | string \| null | Unique identifier code for the role (e.g., ADMIN, HEALTH_PROFESSIONAL). |
| createdAt | date \| null   | Timestamp of record creation.                                           |
| updatedAt | date \| null   | Timestamp of the last update.                                           |
| deletedAt | date \| null   | Timestamp of soft-deletion, if applicable.                              |

**_Example:_**

```json
{
  "id": "8db3d722-6e2a-11ee-8c99-0242ac120002",
  "code": "admin",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": "2026-01-18T12:00:00Z",
  "deletedAt": null
}
```
