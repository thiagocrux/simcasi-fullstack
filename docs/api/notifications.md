# Official reports (SINAN)

_Regulatory reporting for epidemiological surveillance._

## `GET` Find official reports

Filters and retrieves official SINAN (Sistema de Informação de Agravos de Notificação) records linked to patients, tracking health authority reporting status.

### **Endpoint**

```
/api/notifications
```

### **Query Params**

| Name           | Type    | Mandatory | Description                                          |
| :------------- | :------ | :-------- | :--------------------------------------------------- |
| page           | number  | No        | Results page numbering.                              |
| limit          | number  | No        | Items per results page.                              |
| search         | string  | No        | Filter search string for relevant record fields.     |
| patientId      | string  | No        | Filter records for a specific patient ID.            |
| includeDeleted | boolean | No        | Flag to include soft-deleted records in the results. |

**_Example:_**

```bash
curl -X GET "{{baseUrl}}/api/notifications?page=1&limit=20" \
  -H "Authorization: Bearer {{accessToken}}"
```

### **Response Body**

| Name  | Type                   | Description             |
| :---- | :--------------------- | :---------------------- |
| items | notification[] \| null | Array of SINAN records. |
| total | number \| null         | Total count of records. |

**_Example:_**

```json
{
  "items": [
    {
      "id": "notification-uuid-1",
      "patientId": "patient-uuid",
      "sinan": "2026-0001",
      "createdBy": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2026-01-18T10:00:00Z",
      "updatedAt": null,
      "deletedAt": null
    }
  ],
  "total": 1
}
```

## `POST` Register an official report

Commits a new SINAN reporting number and case observations to the database for regulatory compliance tracking.

### **Endpoint**

```
/api/notifications
```

**_Example:_**

```bash
curl -X POST "{{baseUrl}}/api/notifications" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "patient-uuid",
    "sinan": "2026-0001",
    "observations": "Case reported to health authority.",
    "ipAddress": "127.0.0.1",
    "userAgent": "SIMCASI-Client"
  }'
```

### **Request Body**

| Name         | Type           | Mandatory | Description                                                                                               |
| :----------- | :------------- | :-------- | :-------------------------------------------------------------------------------------------------------- |
| patientId    | string \| null | Yes       | Linked patient unique identifier.                                                                         |
| sinan        | string \| null | Yes       | Official SINAN report number (Epidemiological Surveillance).                                              |
| observations | string \| null | No        | Additional case notes for the official report.                                                            |
| ipAddress    | string \| null | Yes       | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent    | string \| null | Yes       | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |

**_Example:_**

```json
{
  "id": "notification-uuid-1",
  "patientId": "patient-uuid",
  "sinan": "2026-0001",
  "observations": "Case reported to health authority.",
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": null,
  "deletedAt": null,
  "ipAddress": "127.0.0.1",
  "userAgent": "Mozilla/5.0"
}
```

### **Response Body**

| Name      | Type           | Description                                                  |
| :-------- | :------------- | :----------------------------------------------------------- |
| id        | string \| null | Unique identifier for the record.                            |
| patientId | string \| null | Linked patient unique identifier.                            |
| sinan     | string \| null | Official SINAN report number (Epidemiological Surveillance). |
| createdBy | string \| null | ID of the user who created this record.                      |
| createdAt | date \| null   | Timestamp of record creation.                                |
| updatedAt | date \| null   | Timestamp of the last update.                                |
| deletedAt | date \| null   | Timestamp of soft-deletion, if applicable.                   |

**_Example:_**

```json
{
  "id": "notification-uuid-1",
  "patientId": "patient-uuid",
  "sinan": "2026-0001",
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": null,
  "deletedAt": null
}
```

## `GET` Get an official report

Accesses the specific SINAN identifier and associated clinical notes for a given health authority report.

### **Endpoint**

```
/api/notifications/:id
```

### **URL Params**

| Name | Type   | Description                                |
| :--- | :----- | :----------------------------------------- |
| id   | string | Unique identifier for the official report. |

**_Example:_**

```bash
curl -X GET "{{baseUrl}}/api/notifications/notification-uuid-1" \
  -H "Authorization: Bearer {{accessToken}}"
```

### **Response Body**

| Name         | Type           | Description                                                  |
| :----------- | :------------- | :----------------------------------------------------------- |
| id           | string \| null | Unique identifier for the record.                            |
| patientId    | string \| null | Linked patient unique identifier.                            |
| sinan        | string \| null | Official SINAN report number (Epidemiological Surveillance). |
| observations | string \| null | Additional case notes for the official report.               |
| createdBy    | string \| null | ID of the user who created this record.                      |
| createdAt    | date \| null   | Timestamp of record creation.                                |
| updatedAt    | date \| null   | Timestamp of the last update.                                |
| deletedAt    | date \| null   | Timestamp of soft-deletion, if applicable.                   |

**_Example:_**

```json
{
  "id": "notification-uuid-1",
  "patientId": "patient-uuid",
  "sinan": "2026-0001",
  "observations": "Case reported to health authority.",
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": null,
  "deletedAt": null
}
```

## `PATCH` Update an official report

Modifies the official SINAN report number or updates regulatory observations for an existing official report.

### **Endpoint**

```
/api/notifications/:id
```

### **URL Params**

| Name | Type   | Description                                |
| :--- | :----- | :----------------------------------------- |
| id   | string | Unique identifier for the official report. |

**_Example:_**

```bash
curl -X PATCH "{{baseUrl}}/api/notifications/notification-uuid-1" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "sinan": "2026-0001-REV1",
    "ipAddress": "127.0.0.1",
    "userAgent": "SIMCASI-Client"
  }'
```

### **Request Body**

| Name         | Type           | Mandatory | Description                                                                                               |
| :----------- | :------------- | :-------- | :-------------------------------------------------------------------------------------------------------- |
| sinan        | string \| null | No        | Official SINAN report number (Epidemiological Surveillance).                                              |
| observations | string \| null | No        | Additional case notes for the official report.                                                            |
| ipAddress    | string \| null | Yes       | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent    | string \| null | Yes       | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |

**_Example:_**

```json
{
  "id": "notification-uuid-1",
  "patientId": "patient-uuid",
  "sinan": "2026-0001-REV1",
  "observations": "Revised observation.",
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": "2026-01-18T11:00:00Z",
  "deletedAt": null,
  "ipAddress": "127.0.0.1",
  "userAgent": "Mozilla/5.0"
}
```

### **Response Body**

| Name      | Type           | Description                                                  |
| :-------- | :------------- | :----------------------------------------------------------- |
| id        | string \| null | Unique identifier for the record.                            |
| patientId | string \| null | Linked patient unique identifier.                            |
| sinan     | string \| null | Official SINAN report number (Epidemiological Surveillance). |
| createdBy | string \| null | ID of the user who created this record.                      |
| createdAt | date \| null   | Timestamp of record creation.                                |
| updatedAt | date \| null   | Timestamp of the last update.                                |
| deletedAt | date \| null   | Timestamp of soft-deletion, if applicable.                   |

**_Example:_**

```json
{
  "id": "notification-uuid-1",
  "patientId": "patient-uuid",
  "sinan": "2026-0001-REV1",
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": "2026-01-18T11:00:00Z",
  "deletedAt": null
}
```

## `DELETE` Delete an official report

Removes a regulatory report record via soft-deletion, while maintaining the SINAN number in the system's audit trails.

### **Endpoint**

```
/api/notifications/:id
```

### **URL Params**

| Name | Type   | Description                                |
| :--- | :----- | :----------------------------------------- |
| id   | string | Unique identifier for the official report. |

**_Example:_**

```bash
curl -X DELETE "{{baseUrl}}/api/notifications/notification-uuid-1" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "ipAddress": "127.0.0.1",
    "userAgent": "SIMCASI-Client"
  }'
```

### **Request Body**

| Name      | Type           | Mandatory | Description                                                                                               |
| :-------- | :------------- | :-------- | :-------------------------------------------------------------------------------------------------------- |
| ipAddress | string \| null | Yes       | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent | string \| null | Yes       | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |

### **Response Body**

_Returns 204 No Content on success._

## `PATCH` Restore an official report

Reverses the soft-deletion of a regulatory report, restoring its linkage to the patient's SINAN compliance history.

### **Endpoint**

```
/api/notifications/:id/restore
```

### **URL Params**

| Name | Type   | Description                                |
| :--- | :----- | :----------------------------------------- |
| id   | string | Unique identifier for the official report. |

**_Example:_**

```bash
curl -X PATCH "{{baseUrl}}/api/notifications/notification-uuid-1/restore" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "ipAddress": "127.0.0.1",
    "userAgent": "SIMCASI-Client"
  }'
```

### **Request Body**

| Name      | Type           | Mandatory | Description                                                                                               |
| :-------- | :------------- | :-------- | :-------------------------------------------------------------------------------------------------------- |
| ipAddress | string \| null | Yes       | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent | string \| null | Yes       | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |

### **Response Body**

| Name      | Type           | Description                                |
| :-------- | :------------- | :----------------------------------------- |
| id        | string \| null | Unique identifier for the record.          |
| createdBy | string \| null | ID of the user who created this record.    |
| createdAt | date \| null   | Timestamp of record creation.              |
| updatedAt | date \| null   | Timestamp of the last update.              |
| deletedAt | date \| null   | Timestamp of soft-deletion, if applicable. |

**_Example:_**

```json
{
  "id": "notification-uuid-1",
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": "2026-01-18T12:00:00Z",
  "deletedAt": null
}
```
