# Treatments

_Documentation of pharmacological dosing._

## `GET` Find treatments

Lists documented pharmacological cycles (medication, dosage, start dates) administered at health centers for patient monitoring.

### **Endpoint**

```
/api/treatments
```

### **Query Params**

| Name           | Type    | Mandatory | Description                                          |
| :------------- | :------ | :-------- | :--------------------------------------------------- |
| page           | number  | No        | Results page numbering.                              |
| limit          | number  | No        | Items per results page.                              |
| search         | string  | No        | Filter search string for relevant record fields.     |
| patientId      | string  | No        | Filter results for a specific patient ID.            |
| includeDeleted | boolean | No        | Flag to include soft-deleted records in the results. |

**_Example:_**

```bash
curl -X GET "{{baseUrl}}/api/treatments?page=1&limit=10&search=Penicilina&patientId=patient-uuid&includeDeleted=false" \
  -H "Authorization: Bearer {{accessToken}}"
```

### **Response Body**

| Name  | Type                | Description                 |
| :---- | :------------------ | :-------------------------- |
| items | treatment[] \| null | Array of treatment records. |
| total | number \| null      | Total count of records.     |

## `POST` Register a treatment

Records administrative pharmacotherapy data, including medication dosage, facility location, and partner notification details.

### **Endpoint**

```
/api/treatments
```

**_Example:_**

```bash
curl -X POST "{{baseUrl}}/api/treatments" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "patient-uuid",
    "medication": "Benzathine Penicillin G",
    "dosage": "2.4 million units",
    "healthCenter": "UBS Central",
    "startDate": "2026-01-15T08:30:00Z",
    "observations": "First dose administered im.",
    "ipAddress": "10.0.0.1",
    "userAgent": "SIMCASI-Client"
  }'
```

### **Request Body**

| Name               | Type           | Mandatory | Description                                                                                               |
| :----------------- | :------------- | :-------- | :-------------------------------------------------------------------------------------------------------- |
| patientId          | string \| null | Yes       | Linked patient unique identifier.                                                                         |
| medication         | string \| null | Yes       | Medication name (e.g., Penicillin).                                                                       |
| dosage             | string \| null | Yes       | Pharmacological dosage information.                                                                       |
| healthCenter       | string \| null | Yes       | Health center unit where treatment was administered.                                                      |
| startDate          | date \| null   | Yes       | ISO 8601 timestamp for treatment start.                                                                   |
| observations       | string \| null | No        | Additional clinical observations.                                                                         |
| partnerInformation | string \| null | No        | Details about partner notification or treatment.                                                          |
| ipAddress          | string \| null | Yes       | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent          | string \| null | Yes       | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |

**_Example:_**

```json
{
  "id": "treatment-uuid-1",
  "patientId": "patient-uuid",
  "medication": "Benzathine Penicillin G",
  "dosage": "2.4 million units",
  "healthCenter": "UBS Central",
  "startDate": "2026-01-15T08:30:00Z",
  "observations": "First dose administered.",
  "partnerInformation": null,
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": null,
  "deletedAt": null,
  "ipAddress": "127.0.0.1",
  "userAgent": "Mozilla/5.0"
}
```

### **Response Body**

| Name       | Type           | Description                                |
| :--------- | :------------- | :----------------------------------------- |
| id         | string \| null | Unique identifier for the record.          |
| patientId  | string \| null | Linked patient unique identifier.          |
| medication | string \| null | Medication name (e.g., Penicillin).        |
| createdBy  | string \| null | ID of the user who created this record.    |
| createdAt  | date \| null   | Timestamp of record creation.              |
| updatedAt  | date \| null   | Timestamp of the last update.              |
| deletedAt  | date \| null   | Timestamp of soft-deletion, if applicable. |

**_Example:_**

```json
{
  "id": "treatment-uuid-1",
  "patientId": "patient-uuid",
  "medication": "Benzathine Penicillin G",
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": null,
  "deletedAt": null
}
```

## `GET` Get a treatment

Retrieves technical dosing specifications, administration facility details, and clinical notes for a specific treatment record.

### **Endpoint**

```
/api/treatments/:id
```

### **URL Params**

| Name | Type   | Description                                 |
| :--- | :----- | :------------------------------------------ |
| id   | string | Unique identifier for the treatment record. |

**_Example:_**

```bash
curl -X GET "{{baseUrl}}/api/treatments/treatment-uuid-1" \
  -H "Authorization: Bearer {{accessToken}}"
```

### **Response Body**

| Name               | Type           | Description                                          |
| :----------------- | :------------- | :--------------------------------------------------- |
| id                 | string \| null | Unique identifier for the record.                    |
| patientId          | string \| null | Linked patient unique identifier.                    |
| medication         | string \| null | Medication name (e.g., Penicillin).                  |
| dosage             | string \| null | Pharmacological dosage information.                  |
| healthCenter       | string \| null | Health center unit where treatment was administered. |
| startDate          | date \| null   | ISO 8601 timestamp for treatment start.              |
| observations       | string \| null | Additional clinical observations.                    |
| partnerInformation | string \| null | Details about partner notification or treatment.     |
| createdBy          | string \| null | ID of the user who created this record.              |
| createdAt          | date \| null   | Timestamp of record creation.                        |
| updatedAt          | date \| null   | Timestamp of the last update.                        |
| deletedAt          | date \| null   | Timestamp of soft-deletion, if applicable.           |

**_Example:_**

```json
{
  "id": "treatment-uuid-1",
  "patientId": "patient-uuid",
  "medication": "Benzathine Penicillin G",
  "dosage": "2.4 million units",
  "healthCenter": "UBS Central",
  "startDate": "2026-01-15T08:30:00Z",
  "observations": "First dose administered im.",
  "partnerInformation": "Partner notify pending.",
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": null,
  "deletedAt": null
}
```

## `PATCH` Update a treatment

Modifies the pharmacological details or clinical observations for an existing treatment record, ensuring full forensic audit of changes.

### **Endpoint**

```
/api/treatments/:id
```

### **URL Params**

| Name | Type   | Description                                 |
| :--- | :----- | :------------------------------------------ |
| id   | string | Unique identifier for the treatment record. |

**_Example:_**

```bash
curl -X PATCH "{{baseUrl}}/api/treatments/treatment-uuid-1" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "dosage": "1.2 million units",
    "ipAddress": "10.0.0.1",
    "userAgent": "SIMCASI-Client"
  }'
```

### **Request Body**

| Name               | Type           | Mandatory | Description                                                                                               |
| :----------------- | :------------- | :-------- | :-------------------------------------------------------------------------------------------------------- |
| medication         | string \| null | No        | Medication name (e.g., Penicillin).                                                                       |
| dosage             | string \| null | No        | Pharmacological dosage information.                                                                       |
| healthCenter       | string \| null | No        | Health center unit where treatment was administered.                                                      |
| startDate          | date \| null   | No        | ISO 8601 timestamp for treatment start.                                                                   |
| observations       | string \| null | No        | Additional clinical observations.                                                                         |
| partnerInformation | string \| null | No        | Details about partner notification or treatment.                                                          |
| ipAddress          | string \| null | Yes       | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent          | string \| null | Yes       | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |

**_Example:_**

```json
{
  "id": "treatment-uuid-1",
  "medication": "Benzathine Penicillin G",
  "dosage": "1.2 million units",
  "healthCenter": "UBS Central",
  "startDate": "2026-01-15T08:30:00Z",
  "observations": "Revised dosage.",
  "partnerInformation": null,
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": "2026-01-18T11:00:00Z",
  "deletedAt": null,
  "ipAddress": "127.0.0.1",
  "userAgent": "Mozilla/5.0"
}
```

### **Response Body**

| Name         | Type           | Description                                          |
| :----------- | :------------- | :--------------------------------------------------- |
| id           | string \| null | Unique identifier for the record.                    |
| medication   | string \| null | Medication name (e.g., Penicillin).                  |
| dosage       | string \| null | Pharmacological dosage information.                  |
| healthCenter | string \| null | Health center unit where treatment was administered. |
| createdBy    | string \| null | ID of the user who created this record.              |
| createdAt    | date \| null   | Timestamp of record creation.                        |
| updatedAt    | date \| null   | Timestamp of the last update.                        |
| deletedAt    | date \| null   | Timestamp of soft-deletion, if applicable.           |

**_Example:_**

```json
{
  "id": "treatment-uuid-1",
  "medication": "Benzathine Penicillin G",
  "dosage": "1.2 million units",
  "healthCenter": "UBS Central",
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": "2026-01-18T11:00:00Z",
  "deletedAt": null
}
```

## `DELETE` Delete a treatment

Removes a pharmacotherapy record from active tracking through soft-deletion, while preserving medication history for medical audits.

### **Endpoint**

```
/api/treatments/:id
```

### **URL Params**

| Name | Type   | Description                                 |
| :--- | :----- | :------------------------------------------ |
| id   | string | Unique identifier for the treatment record. |

**_Example:_**

```bash
curl -X DELETE "{{baseUrl}}/api/treatments/treatment-uuid-1" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "ipAddress": "10.0.0.1",
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

## `PATCH` Restore a treatment

Reinstates a soft-deleted treatment record into the patient's pharmacological history.

### **Endpoint**

```
/api/treatments/:id/restore
```

### **URL Params**

| Name | Type   | Description                                 |
| :--- | :----- | :------------------------------------------ |
| id   | string | Unique identifier for the treatment record. |

**_Example:_**

```bash
curl -X PATCH "{{baseUrl}}/api/treatments/treatment-uuid-1/restore" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "ipAddress": "10.0.0.1",
    "userAgent": "SIMCASI-Client"
  }'
```

### **Request Body**

| Name      | Type           | Mandatory | Description                                                                                               |
| :-------- | :------------- | :-------- | :-------------------------------------------------------------------------------------------------------- |
| ipAddress | string \| null | Yes       | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent | string \| null | Yes       | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |

### **Response Body**

| Name       | Type           | Description                                |
| :--------- | :------------- | :----------------------------------------- |
| id         | string \| null | Unique identifier for the record.          |
| medication | string \| null | Medication name (e.g., Penicillin).        |
| createdBy  | string \| null | ID of the user who created this record.    |
| createdAt  | date \| null   | Timestamp of record creation.              |
| updatedAt  | date \| null   | Timestamp of the last update.              |
| deletedAt  | date \| null   | Timestamp of soft-deletion, if applicable. |

**_Example:_**

```json
{
  "id": "treatment-uuid-1",
  "medication": "Benzathine Penicillin G",
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": "2026-01-18T12:00:00Z",
  "deletedAt": null
}
```
