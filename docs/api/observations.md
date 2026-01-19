# Observations

_Tracking of patient progress and symptoms._

## `GET` Find observations

Lists paginated clinical evolution entries and qualitative progress notes for patients, including sexual partner treatment status.

### **Endpoint**

```
/api/observations
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
curl -X GET "{{baseUrl}}/api/observations?page=1&limit=20" \
  -H "Authorization: Bearer {{accessToken}}"
```

### **Response Body**

| Name  | Type                  | Description                   |
| :---- | :-------------------- | :---------------------------- |
| items | observation[] \| null | Array of observation records. |
| total | number \| null        | Total count of records.       |

**_Example:_**

```json
{
  "items": [
    {
      "id": "obs-uuid-1",
      "patientId": "patient-uuid",
      "hasPartnerBeingTreated": true,
      "createdBy": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2026-01-18T10:00:00Z",
      "updatedAt": null,
      "deletedAt": null
    }
  ],
  "total": 1
}
```

## `POST` Register an observation

Commits a new clinical evolution entry, documenting symptom updates and verifying partner treatment protocols.

### **Endpoint**

```
/api/observations
```

**_Example:_**

```bash
curl -X POST "{{baseUrl}}/api/observations" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "patient-uuid",
    "hasPartnerBeingTreated": true,
    "observations": "Patient reports no symptoms after 1st dose.",
    "ipAddress": "127.0.0.1",
    "userAgent": "SIMCASI-Client"
  }'
```

### **Request Body**

| Name                   | Type            | Mandatory | Description                                                                                               |
| :--------------------- | :-------------- | :-------- | :-------------------------------------------------------------------------------------------------------- |
| patientId              | string \| null  | Yes       | Linked patient unique identifier.                                                                         |
| hasPartnerBeingTreated | boolean \| null | Yes       | Indicates if the patient's sexual partner is undergoing treatment.                                        |
| observations           | string \| null  | Yes       | Clinical observations or case notes.                                                                      |
| ipAddress              | string \| null  | Yes       | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent              | string \| null  | Yes       | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |

**_Example:_**

```json
{
  "id": "obs-uuid-1",
  "patientId": "patient-uuid",
  "hasPartnerBeingTreated": true,
  "observations": "Patient reports no symptoms after 1st dose.",
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": null,
  "deletedAt": null,
  "ipAddress": "127.0.0.1",
  "userAgent": "Mozilla/5.0"
}
```

### **Response Body**

| Name         | Type           | Description                                |
| :----------- | :------------- | :----------------------------------------- |
| id           | string \| null | Unique identifier for the record.          |
| patientId    | string \| null | Linked patient unique identifier.          |
| observations | string \| null | Clinical observations or case notes.       |
| createdBy    | string \| null | ID of the user who created this record.    |
| createdAt    | date \| null   | Timestamp of record creation.              |
| updatedAt    | date \| null   | Timestamp of the last update.              |
| deletedAt    | date \| null   | Timestamp of soft-deletion, if applicable. |

**_Example:_**

```json
{
  "id": "obs-uuid-1",
  "patientId": "patient-uuid",
  "observations": "Patient reports no symptoms after 1st dose.",
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": null,
  "deletedAt": null
}
```

## `GET` Get an observation

Retrieves technical details for a specific clinical evolution record, including notes and partner tracking metadata.

### **Endpoint**

```
/api/observations/:id
```

### **URL Params**

| Name | Type   | Description                            |
| :--- | :----- | :------------------------------------- |
| id   | string | Unique identifier for the observation. |

**_Example:_**

```bash
curl -X GET "{{baseUrl}}/api/observations/obs-uuid-1" \
  -H "Authorization: Bearer {{accessToken}}"
```

### **Response Body**

| Name                   | Type            | Description                                                        |
| :--------------------- | :-------------- | :----------------------------------------------------------------- |
| id                     | string \| null  | Unique identifier for the record.                                  |
| patientId              | string \| null  | Linked patient unique identifier.                                  |
| hasPartnerBeingTreated | boolean \| null | Indicates if the patient's sexual partner is undergoing treatment. |
| observations           | string \| null  | Clinical observations or case notes.                               |
| createdBy              | string \| null  | ID of the user who created this record.                            |
| createdAt              | date \| null    | Timestamp of record creation.                                      |
| updatedAt              | date \| null    | Timestamp of the last update.                                      |
| deletedAt              | date \| null    | Timestamp of soft-deletion, if applicable.                         |

**_Example:_**

```json
{
  "id": "obs-uuid-1",
  "patientId": "patient-uuid",
  "hasPartnerBeingTreated": true,
  "observations": "Patient reports no symptoms after 1st dose.",
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": null,
  "deletedAt": null
}
```

## `PATCH` Update an observation

Modifies clinical notes or partner treatment status for an existing clinical evolution entry, maintained with full auditing.

### **Endpoint**

```
/api/observations/:id
```

### **URL Params**

| Name | Type   | Description                            |
| :--- | :----- | :------------------------------------- |
| id   | string | Unique identifier for the observation. |

**_Example:_**

```bash
curl -X PATCH "{{baseUrl}}/api/observations/obs-uuid-1" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "observations": "Symptoms resolved after full cycle.",
    "ipAddress": "127.0.0.1",
    "userAgent": "SIMCASI-Client"
  }'
```

### **Request Body**

| Name                   | Type            | Mandatory | Description                                                                                               |
| :--------------------- | :-------------- | :-------- | :-------------------------------------------------------------------------------------------------------- |
| observations           | string \| null  | No        | Clinical observations or case notes.                                                                      |
| hasPartnerBeingTreated | boolean \| null | No        | Indicates if the patient's sexual partner is undergoing treatment.                                        |
| ipAddress              | string \| null  | Yes       | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent              | string \| null  | Yes       | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |

**_Example:_**

```json
{
  "id": "obs-uuid-1",
  "hasPartnerBeingTreated": true,
  "observations": "Symptoms resolved after full cycle.",
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": "2026-01-18T11:00:00Z",
  "deletedAt": null,
  "ipAddress": "127.0.0.1",
  "userAgent": "Mozilla/5.0"
}
```

### **Response Body**

| Name         | Type           | Description                                |
| :----------- | :------------- | :----------------------------------------- |
| id           | string \| null | Unique identifier for the record.          |
| observations | string \| null | Clinical observations or case notes.       |
| createdBy    | string \| null | ID of the user who created this record.    |
| createdAt    | date \| null   | Timestamp of record creation.              |
| updatedAt    | date \| null   | Timestamp of the last update.              |
| deletedAt    | date \| null   | Timestamp of soft-deletion, if applicable. |

**_Example:_**

```json
{
  "id": "obs-uuid-1",
  "observations": "Symptoms resolved after full cycle.",
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": "2026-01-18T11:00:00Z",
  "deletedAt": null
}
```

## `DELETE` Delete an observation

Removes an evolution entry from the active patient history through soft-deletion while maintaining clinical tracking for audit purposes.

### **Endpoint**

```
/api/observations/:id
```

### **URL Params**

| Name | Type   | Description                            |
| :--- | :----- | :------------------------------------- |
| id   | string | Unique identifier for the observation. |

**_Example:_**

```bash
curl -X DELETE "{{baseUrl}}/api/observations/obs-uuid-1" \
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

## `PATCH` Restore an observation

Reinstates a soft-deleted clinical evolution entry into the patient's medical record history.

### **Endpoint**

```
/api/observations/:id/restore
```

### **URL Params**

| Name | Type   | Description                            |
| :--- | :----- | :------------------------------------- |
| id   | string | Unique identifier for the observation. |

**_Example:_**

```bash
curl -X PATCH "{{baseUrl}}/api/observations/obs-uuid-1/restore" \
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

| Name         | Type           | Description                                |
| :----------- | :------------- | :----------------------------------------- |
| id           | string \| null | Unique identifier for the record.          |
| observations | string \| null | Clinical observations or case notes.       |
| createdBy    | string \| null | ID of the user who created this record.    |
| createdAt    | date \| null   | Timestamp of record creation.              |
| updatedAt    | date \| null   | Timestamp of the last update.              |
| deletedAt    | date \| null   | Timestamp of soft-deletion, if applicable. |

**_Example:_**

```json
{
  "id": "obs-uuid-1",
  "observations": "Patient reports no symptoms after 1st dose.",
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": "2026-01-18T12:00:00Z",
  "deletedAt": null
}
```
