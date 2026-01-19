# Audit logs

_Immutable record of every lifecycle change._

## `GET` Find audit logs

Retrieves a paginated history of all state-altering operations, including technical identifiers, old/new value snapshots, and authorship metadata.

### **Endpoint**

```
/api/audit-logs
```

**_Example:_**

```bash
curl -X GET "{{baseUrl}}/api/audit-logs?page=1&limit=50" \
  -H "Authorization: Bearer {{accessToken}}"
```

### **Query Params**

| Name       | Type   | Mandatory | Description                                      |
| :--------- | :----- | :-------- | :----------------------------------------------- |
| page       | number | No        | Results page numbering.                          |
| limit      | number | No        | Items per results page.                          |
| search     | string | No        | Filter search string for relevant record fields. |
| userId     | string | No        | Filter records for a specific user ID.           |
| action     | string | No        | Filter records for a specific action type.       |
| entityName | string | No        | Filter records for a specific entity type.       |
| entityId   | string | No        | Filter records for a specific entity ID.         |

### **Response Body**

| Name  | Type                | Description                                                 |
| :---- | :------------------ | :---------------------------------------------------------- |
| items | audit-log[] \| null | Array of forensic records. (See [11.2] for full log schema) |
| total | number \| null      | Total count of logs.                                        |

**_Example:_**

```json
{
  "items": [
    {
      "id": "log-uuid",
      "userId": "user-uuid",
      "action": "UPDATE",
      "entityName": "Patient",
      "entityId": "patient-uuid",
      "oldValues": { "name": "Maria" },
      "newValues": { "name": "Maria S." },
      "ipAddress": "1.2.3.4",
      "createdAt": "2026-01-17T11:00:00Z"
    }
  ],
  "total": 120
}
```

## `GET` Get an audit log

Fetches a single forensic record containing the complete diff of a specific transaction, including client metadata (IP/User Agent).

### **Endpoint**

```
/api/audit-logs/:id
```

### **URL Params**

| Name | Type   | Description                                    |
| :--- | :----- | :--------------------------------------------- |
| id   | string | Unique identifier for the audit log (UUID v4). |

**_Example:_**

```bash
curl -X GET "{{baseUrl}}/api/audit-logs/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer {{accessToken}}"
```

### **Response Body**

| Name       | Type           | Description                                                                                               |
| :--------- | :------------- | :-------------------------------------------------------------------------------------------------------- |
| id         | string \| null | Technical identifier (UUID v4).                                                                           |
| userId     | string \| null | ID of the user who performed the action.                                                                  |
| action     | string \| null | Type of action performed (e.g., CREATE, UPDATE, DELETE, RESTORE).                                         |
| entityName | string \| null | The entity affected by the action (e.g., Patient, User).                                                  |
| entityId   | string \| null | Unique identifier of the affected entity.                                                                 |
| oldValues  | object \| null | Snapshot of the state before the changes.                                                                 |
| newValues  | object \| null | Snapshot of the state after the changes.                                                                  |
| ipAddress  | string \| null | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent  | string \| null | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |
| createdAt  | string \| null | Date and time (ISO 8601) when the record was created.                                                     |

**_Example:_**

```json
{
  "id": "log-uuid",
  "userId": "user-uuid",
  "action": "UPDATE",
  "entityName": "Patient",
  "entityId": "patient-uuid",
  "oldValues": { "name": "Maria" },
  "newValues": { "name": "Maria Socorro" },
  "ipAddress": "1.2.3.4",
  "userAgent": "Mozilla/5.0...",
  "createdAt": "2026-01-17T11:00:00Z"
}
```
