# Exams

_Monitoring of syphilis diagnosis and titration history._

## `GET` Find exams

Accesses the history of treponemal and nontreponemal tests (titration) for monitoring diagnosis and treatment efficacy.

### **Endpoint**

```
/api/exams
```

**_Example:_**

```bash
curl -X GET "{{baseUrl}}/api/exams?page=1&limit=10&patientId=patient-uuid" \
  -H "Authorization: Bearer {{accessToken}}"
```

### **Query Params**

| Name           | Type    | Mandatory | Description                                          |
| :------------- | :------ | :-------- | :--------------------------------------------------- |
| page           | number  | No        | Results page numbering.                              |
| limit          | number  | No        | Items per results page.                              |
| search         | string  | No        | Filter search string for relevant record fields.     |
| patientId      | string  | No        | Filter results for a specific patient ID.            |
| includeDeleted | boolean | No        | Flag to include soft-deleted records in the results. |

### **Response Body**

| Name  | Type           | Description           |
| :---- | :------------- | :-------------------- |
| items | exam[] \| null | List of exam records. |
| total | number \| null | Total count of exams. |

**_Example:_**

```json
{
  "items": [
    {
      "id": "exam-uuid",
      "patientId": "patient-uuid",
      "treponemalTestType": "RAPID_TEST",
      "treponemalTestResult": "REAGENT",
      "treponemalTestDate": "2026-01-10T14:00:00Z",
      "treponemalTestLocation": "UBS Centro",
      "nontreponemalVdrlTest": "VDRL",
      "nontreponemalTestTitration": "1/32",
      "nontreponemalTestDate": "2026-01-12T09:00:00Z",
      "otherNontreponemalTest": null,
      "otherNontreponemalTestDate": null,
      "referenceObservations": "Initial diagnosis titration.",
      "createdBy": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2026-01-18T10:00:00Z",
      "updatedAt": null,
      "deletedAt": null
    }
  ],
  "total": 1
}
```

## `POST` Register an exam

Records new laboratory results, linking titration levels and test methodologies to a specific patient's clinical timeline.

### **Endpoint**

```
/api/exams
```

**_Example:_**

```bash
curl -X POST "{{baseUrl}}/api/exams" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "patient-uuid",
    "treponemalTestType": "RAPID_TEST",
    "treponemalTestResult": "REAGENT",
    "treponemalTestDate": "2026-01-10T14:00:00Z",
    "treponemalTestLocation": "UBS Centro",
    "nontreponemalVdrlTest": "VDRL",
    "nontreponemalTestTitration": "1/16",
    "nontreponemalTestDate": "2026-01-12T09:00:00Z",
    "referenceObservations": "Initial diagnosis.",
    "ipAddress": "127.0.0.1",
    "userAgent": "Mozilla/5.0"
  }'
```

### **Request Body**

| Name                       | Type           | Mandatory | Description                                                                                               |
| :------------------------- | :------------- | :-------- | :-------------------------------------------------------------------------------------------------------- |
| patientId                  | string \| null | Yes       | Linked patient unique identifier.                                                                         |
| treponemalTestType         | string \| null | Yes       | Methodology used for treponemal test (e.g., RAPID_TEST).                                                  |
| treponemalTestResult       | string \| null | Yes       | Clinical result of the treponemal test.                                                                   |
| treponemalTestDate         | string \| null | Yes       | Date and time (ISO 8601) when the test was performed.                                                     |
| treponemalTestLocation     | string \| null | Yes       | Healthcare facility where treponemal test was performed.                                                  |
| nontreponemalVdrlTest      | string \| null | Yes       | Type of nontreponemal test methodology.                                                                   |
| nontreponemalTestTitration | string \| null | Yes       | Dilution titer result (e.g., 1/16).                                                                       |
| nontreponemalTestDate      | string \| null | Yes       | Date and time (ISO 8601) when the nontreponemal test was performed.                                       |
| otherNontreponemalTest     | string \| null | No        | Alternative nontreponemal test identifier, if any.                                                        |
| otherNontreponemalTestDate | string \| null | No        | ISO 8601 timestamp for alternative test execution.                                                        |
| referenceObservations      | string \| null | Yes       | Clinical and reference observations regarding the exam.                                                   |
| ipAddress                  | string \| null | Yes       | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent                  | string \| null | Yes       | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |

**_Example:_**

```json
{
  "id": "exam-uuid",
  "patientId": "patient-uuid",
  "treponemalTestType": "RAPID_TEST",
  "treponemalTestResult": "REAGENT",
  "treponemalTestDate": "2026-01-10T14:00:00Z",
  "treponemalTestLocation": "UBS Centro",
  "nontreponemalVdrlTest": "VDRL",
  "nontreponemalTestTitration": "1/16",
  "nontreponemalTestDate": "2026-01-12T09:00:00Z",
  "otherNontreponemalTest": null,
  "otherNontreponemalTestDate": null,
  "referenceObservations": "Initial diagnosis.",
  "createdBy": "user-uuid",
  "createdAt": "2026-01-12T10:00:00Z",
  "updatedAt": null,
  "deletedAt": null,
  "ipAddress": "127.0.0.1",
  "userAgent": "Mozilla/5.0"
}
```

### **Response Body**

| Name                       | Type           | Description                                                               |
| :------------------------- | :------------- | :------------------------------------------------------------------------ |
| id                         | string \| null | Technical identifier (UUID v4).                                           |
| patientId                  | string \| null | Linked patient unique identifier.                                         |
| treponemalTestType         | string \| null | Methodology used for treponemal test (e.g., RAPID_TEST).                  |
| treponemalTestResult       | string \| null | Clinical result of the treponemal test.                                   |
| treponemalTestDate         | string \| null | Date and time (ISO 8601) when the test was performed.                     |
| treponemalTestLocation     | string \| null | Healthcare facility where treponemal test was performed.                  |
| nontreponemalVdrlTest      | string \| null | Type of nontreponemal test methodology.                                   |
| nontreponemalTestTitration | string \| null | Dilution titer result (e.g., 1/16).                                       |
| nontreponemalTestDate      | string \| null | Date and time (ISO 8601) when the nontreponemal test was performed.       |
| otherNontreponemalTest     | string \| null | Alternative nontreponemal test identifier, if any.                        |
| otherNontreponemalTestDate | string \| null | ISO 8601 timestamp for alternative test execution.                        |
| referenceObservations      | string \| null | Clinical and reference observations regarding the exam.                   |
| createdBy                  | string \| null | ID of the user who created this record.                                   |
| createdAt                  | string \| null | Date and time (ISO 8601) when the record was created.                     |
| updatedAt                  | string \| null | Date and time (ISO 8601) when the record was last updated.                |
| deletedAt                  | string \| null | Date and time (ISO 8601) when the record was soft-deleted, if applicable. |

**_Example:_**

```json
{
  "id": "exam-uuid-123",
  "patientId": "patient-uuid",
  "treponemalTestType": "RAPID_TEST",
  "treponemalTestResult": "REAGENT",
  "treponemalTestDate": "2026-01-10T14:00:00Z",
  "treponemalTestLocation": "UBS Centro",
  "nontreponemalVdrlTest": "VDRL",
  "nontreponemalTestTitration": "1/16",
  "nontreponemalTestDate": "2026-01-12T09:00:00Z",
  "otherNontreponemalTest": null,
  "otherNontreponemalTestDate": null,
  "referenceObservations": "Initial diagnosis.",
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": null,
  "deletedAt": null
}
```

## `GET` Get an exam

Retrieves technical specifications, titration results, and clinical observations from a single exam record.

### **Endpoint**

```
/api/exams/:id
```

**_Example:_**

```bash
curl -X GET "{{baseUrl}}/api/exams/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer {{accessToken}}"
```

### **URL Params**

| Name | Type   | Description                                      |
| :--- | :----- | :----------------------------------------------- |
| id   | string | Unique identifier for the exam record (UUID v4). |

### **Response Body**

| Name                       | Type           | Description                                                               |
| :------------------------- | :------------- | :------------------------------------------------------------------------ |
| id                         | string \| null | Technical identifier (UUID v4).                                           |
| patientId                  | string \| null | Linked patient unique identifier.                                         |
| treponemalTestType         | string \| null | Methodology used for treponemal test (e.g., RAPID_TEST).                  |
| treponemalTestResult       | string \| null | Clinical result of the treponemal test.                                   |
| treponemalTestDate         | string \| null | Date and time (ISO 8601) when the test was performed.                     |
| treponemalTestLocation     | string \| null | Healthcare facility where treponemal test was performed.                  |
| nontreponemalVdrlTest      | string \| null | Type of nontreponemal test methodology.                                   |
| nontreponemalTestTitration | string \| null | Dilution titer result (e.g., 1/16).                                       |
| nontreponemalTestDate      | string \| null | Date and time (ISO 8601) when the nontreponemal test was performed.       |
| otherNontreponemalTest     | string \| null | Alternative nontreponemal test identifier, if any.                        |
| otherNontreponemalTestDate | string \| null | ISO 8601 timestamp for alternative test execution.                        |
| referenceObservations      | string \| null | Clinical and reference observations regarding the exam.                   |
| createdBy                  | string \| null | ID of the user who created this record.                                   |
| createdAt                  | string \| null | Date and time (ISO 8601) when the record was created.                     |
| updatedAt                  | string \| null | Date and time (ISO 8601) when the record was last updated.                |
| deletedAt                  | string \| null | Date and time (ISO 8601) when the record was soft-deleted, if applicable. |

**_Example:_**

```json
{
  "id": "exam-uuid",
  "patientId": "patient-uuid",
  "treponemalTestType": "RAPID_TEST",
  "treponemalTestResult": "REAGENT",
  "treponemalTestDate": "2026-01-10T14:00:00Z",
  "treponemalTestLocation": "UBS Centro",
  "nontreponemalVdrlTest": "VDRL",
  "nontreponemalTestTitration": "1/32",
  "nontreponemalTestDate": "2026-01-12T09:00:00Z",
  "otherNontreponemalTest": null,
  "otherNontreponemalTestDate": null,
  "referenceObservations": "Clinical monitoring.",
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": null,
  "deletedAt": null
}
```

## `PATCH` Update an exam

Adjusts laboratory results or clinical observations for an existing exam record, subject to full forensic audit tracking.

### **Endpoint**

```
/api/exams/:id
```

**_Example:_**

```bash
curl -X PATCH "{{baseUrl}}/api/exams/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "treponemalTestResult": "NON_REAGENT",
    "ipAddress": "127.0.0.1",
    "userAgent": "Mozilla/5.0"
  }'
```

### **URL Params**

| Name | Type   | Description                                      |
| :--- | :----- | :----------------------------------------------- |
| id   | string | Unique identifier for the exam record (UUID v4). |

### **Request Body**

| Name                       | Type           | Mandatory | Description                                                                                               |
| :------------------------- | :------------- | :-------- | :-------------------------------------------------------------------------------------------------------- |
| patientId                  | string \| null | No        | Linked patient unique identifier.                                                                         |
| treponemalTestType         | string \| null | No        | Methodology used for treponemal test (e.g., RAPID_TEST).                                                  |
| treponemalTestResult       | string \| null | No        | Clinical result of the treponemal test.                                                                   |
| treponemalTestDate         | string \| null | No        | Date and time (ISO 8601) when the test was performed.                                                     |
| treponemalTestLocation     | string \| null | No        | Healthcare facility where treponemal test was performed.                                                  |
| nontreponemalVdrlTest      | string \| null | No        | Type of nontreponemal test methodology.                                                                   |
| nontreponemalTestTitration | string \| null | No        | Dilution titer result (e.g., 1/16).                                                                       |
| nontreponemalTestDate      | string \| null | No        | Date and time (ISO 8601) when the nontreponemal test was performed.                                       |
| otherNontreponemalTest     | string \| null | No        | Alternative nontreponemal test identifier, if any.                                                        |
| otherNontreponemalTestDate | string \| null | No        | ISO 8601 timestamp for alternative test execution.                                                        |
| referenceObservations      | string \| null | No        | Clinical and reference observations regarding the exam.                                                   |
| ipAddress                  | string \| null | Yes       | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent                  | string \| null | Yes       | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |

**_Example:_**

```json
{
  "id": "exam-uuid",
  "patientId": "patient-uuid",
  "treponemalTestType": "RAPID_TEST",
  "treponemalTestResult": "NON_REAGENT",
  "treponemalTestDate": "2026-01-10T14:00:00Z",
  "treponemalTestLocation": "UBS Centro",
  "nontreponemalVdrlTest": "VDRL",
  "nontreponemalTestTitration": "1/32",
  "nontreponemalTestDate": "2026-01-12T09:00:00Z",
  "otherNontreponemalTest": null,
  "otherNontreponemalTestDate": null,
  "referenceObservations": "Updated observation.",
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": "2026-01-18T11:00:00Z",
  "deletedAt": null,
  "ipAddress": "127.0.0.1",
  "userAgent": "Mozilla/5.0"
}
```

### **Response Body**

| Name                       | Type           | Description                                                               |
| :------------------------- | :------------- | :------------------------------------------------------------------------ |
| id                         | string \| null | Technical identifier (UUID v4).                                           |
| patientId                  | string \| null | Linked patient unique identifier.                                         |
| treponemalTestType         | string \| null | Methodology used for treponemal test (e.g., RAPID_TEST).                  |
| treponemalTestResult       | string \| null | Clinical result of the treponemal test.                                   |
| treponemalTestDate         | string \| null | Date and time (ISO 8601) when the test was performed.                     |
| treponemalTestLocation     | string \| null | Healthcare facility where treponemal test was performed.                  |
| nontreponemalVdrlTest      | string \| null | Type of nontreponemal test methodology.                                   |
| nontreponemalTestTitration | string \| null | Dilution titer result (e.g., 1/16).                                       |
| nontreponemalTestDate      | string \| null | Date and time (ISO 8601) when the nontreponemal test was performed.       |
| otherNontreponemalTest     | string \| null | Alternative nontreponemal test identifier, if any.                        |
| otherNontreponemalTestDate | string \| null | ISO 8601 timestamp for alternative test execution.                        |
| referenceObservations      | string \| null | Clinical and reference observations regarding the exam.                   |
| createdBy                  | string \| null | ID of the user who created this record.                                   |
| createdAt                  | string \| null | Date and time (ISO 8601) when the record was created.                     |
| updatedAt                  | string \| null | Date and time (ISO 8601) when the record was last updated.                |
| deletedAt                  | string \| null | Date and time (ISO 8601) when the record was soft-deleted, if applicable. |

**_Example:_**

```json
{
  "id": "exam-uuid",
  "patientId": "patient-uuid",
  "treponemalTestType": "RAPID_TEST",
  "treponemalTestResult": "NON_REAGENT",
  "treponemalTestDate": "2026-01-10T14:00:00Z",
  "treponemalTestLocation": "UBS Centro",
  "nontreponemalVdrlTest": "VDRL",
  "nontreponemalTestTitration": "1/32",
  "nontreponemalTestDate": "2026-01-12T09:00:00Z",
  "otherNontreponemalTest": null,
  "otherNontreponemalTestDate": null,
  "referenceObservations": "Updated result status.",
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": "2026-01-18T11:00:00Z",
  "deletedAt": null
}
```

## `DELETE` Delete an exam

Removes an exam from the active clinical dashboard using a soft-deletion pattern, while keeping laboratory data in the audit history.

### **Endpoint**

```
/api/exams/:id
```

**_Example:_**

```bash
curl -X DELETE "{{baseUrl}}/api/exams/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "ipAddress": "127.0.0.1",
    "userAgent": "Mozilla/5.0"
  }'
```

### **URL Params**

| Name | Type   | Description                                      |
| :--- | :----- | :----------------------------------------------- |
| id   | string | Unique identifier for the exam record (UUID v4). |

### **Request Body**

| Name      | Type           | Mandatory | Description                                                                                               |
| :-------- | :------------- | :-------- | :-------------------------------------------------------------------------------------------------------- |
| ipAddress | string \| null | Yes       | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent | string \| null | Yes       | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |

### **Response Body**

_Returns 204 No Content on success._

## `PATCH` Restore an exam

Reinstates a soft-deleted exam record into the patient's diagnostic history and monitoring interface.

### **Endpoint**

```
/api/exams/:id/restore
```

**_Example:_**

```bash
curl -X PATCH "{{baseUrl}}/api/exams/550e8400-e29b-41d4-a716-446655440000/restore" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "ipAddress": "127.0.0.1",
    "userAgent": "Mozilla/5.0"
  }'
```

### **URL Params**

| Name | Type   | Description                                      |
| :--- | :----- | :----------------------------------------------- |
| id   | string | Unique identifier for the exam record (UUID v4). |

### **Request Body**

| Name      | Type           | Mandatory | Description                                                                                               |
| :-------- | :------------- | :-------- | :-------------------------------------------------------------------------------------------------------- |
| ipAddress | string \| null | Yes       | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent | string \| null | Yes       | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |

### **Response Body**

| Name                       | Type           | Description                                                               |
| :------------------------- | :------------- | :------------------------------------------------------------------------ |
| id                         | string \| null | Technical identifier (UUID v4).                                           |
| patientId                  | string \| null | Linked patient unique identifier.                                         |
| treponemalTestType         | string \| null | Methodology used for treponemal test (e.g., RAPID_TEST).                  |
| treponemalTestResult       | string \| null | Clinical result of the treponemal test.                                   |
| treponemalTestDate         | string \| null | Date and time (ISO 8601) when the test was performed.                     |
| treponemalTestLocation     | string \| null | Healthcare facility where treponemal test was performed.                  |
| nontreponemalVdrlTest      | string \| null | Type of nontreponemal test methodology.                                   |
| nontreponemalTestTitration | string \| null | Dilution titer result (e.g., 1/16).                                       |
| nontreponemalTestDate      | string \| null | Date and time (ISO 8601) when the nontreponemal test was performed.       |
| otherNontreponemalTest     | string \| null | Alternative nontreponemal test identifier, if any.                        |
| otherNontreponemalTestDate | string \| null | ISO 8601 timestamp for alternative test execution.                        |
| referenceObservations      | string \| null | Clinical and reference observations regarding the exam.                   |
| createdBy                  | string \| null | ID of the user who created this record.                                   |
| createdAt                  | string \| null | Date and time (ISO 8601) when the record was created.                     |
| updatedAt                  | string \| null | Date and time (ISO 8601) when the record was last updated.                |
| deletedAt                  | string \| null | Date and time (ISO 8601) when the record was soft-deleted, if applicable. |

**_Example:_**

```json
{
  "id": "exam-uuid",
  "patientId": "patient-uuid",
  "treponemalTestType": "RAPID_TEST",
  "treponemalTestResult": "REAGENT",
  "treponemalTestDate": "2026-01-10T14:00:00Z",
  "treponemalTestLocation": "UBS Centro",
  "nontreponemalVdrlTest": "VDRL",
  "nontreponemalTestTitration": "1/32",
  "nontreponemalTestDate": "2026-01-12T09:00:00Z",
  "otherNontreponemalTest": null,
  "otherNontreponemalTestDate": null,
  "referenceObservations": "Restored exam record.",
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": "2026-01-18T12:00:00Z",
  "deletedAt": null
}
```
