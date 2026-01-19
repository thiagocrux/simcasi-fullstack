# Patients

_Core demographic and medical identity repository._

## `GET` Find patients

Searches for patients using name, CPF, or SUS card filters, supporting paginated results and administrative visibility of deleted records.

### **Endpoint**

```
/api/patients
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
curl -X GET "{{baseUrl}}/api/patients?page=1&limit=20" \
  -H "Authorization: Bearer {{accessToken}}"
```

### **Response Body**

| Name  | Type              | Description               |
| :---- | :---------------- | :------------------------ |
| items | patient[] \| null | Array of patient records. |
| total | number \| null    | Total mathematical count. |

**_Example:_**

```json
{
  "items": [
    {
      "id": "patient-uuid",
      "name": "Maria Socorro",
      "cpf": "123.456.789-01",
      "susCardNumber": "123456789012345",
      "createdBy": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2026-01-18T10:00:00Z",
      "updatedAt": null,
      "deletedAt": null
    }
  ],
  "total": 1
}
```

## `POST` Register a patient

Initializes a comprehensive medical profile including demographic, geographic, and tracking classification data.

### **Endpoint**

```
/api/patients
```

**_Example:_**

```bash
curl -X POST "{{baseUrl}}/api/patients" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João da Silva",
    "cpf": "98765432100",
    "susCardNumber": "700000000000001",
    "birthDate": "1985-05-20T00:00:00.000Z",
    "sex": "M",
    "gender": "Masculine",
    "sexuality": "Heterosexual",
    "race": "Pardo",
    "nationality": "Brasileira",
    "schooling": "Ensino Médio Completo",
    "monitoringType": "GENERAL",
    "state": "SP",
    "city": "São Paulo",
    "neighborhood": "Centro",
    "street": "Rua das Flores",
    "houseNumber": "123",
    "isDeceased": false,
    "motherName": "Maria da Silva",
    "ipAddress": "192.168.0.10",
    "userAgent": "Mozilla/5.0"
  }'
```

### **Request Body**

| Name           | Type            | Mandatory | Description                                                                                               |
| :------------- | :-------------- | :-------- | :-------------------------------------------------------------------------------------------------------- |
| susCardNumber  | string \| null  | Yes       | National Health Card ID (CNS).                                                                            |
| name           | string \| null  | Yes       | Full legal name.                                                                                          |
| cpf            | string \| null  | Yes       | Brazilian Taxpayer ID.                                                                                    |
| socialName     | string \| null  | No        | Preferred or social name.                                                                                 |
| birthDate      | date \| null    | Yes       | Patient's date of birth.                                                                                  |
| race           | string \| null  | Yes       | Patient's declared color or race.                                                                         |
| sex            | string \| null  | Yes       | Biological sex.                                                                                           |
| gender         | string \| null  | Yes       | Gender identity.                                                                                          |
| sexuality      | string \| null  | Yes       | Sexual orientation.                                                                                       |
| nationality    | string \| null  | Yes       | Country of origin.                                                                                        |
| schooling      | string \| null  | Yes       | Level of education.                                                                                       |
| phone          | string \| null  | No        | Contact telephone number.                                                                                 |
| email          | string \| null  | No        | Contact email address.                                                                                    |
| motherName     | string \| null  | Yes       | Full mother's name.                                                                                       |
| fatherName     | string \| null  | No        | Full father's name.                                                                                       |
| isDeceased     | boolean \| null | Yes       | Death status flag.                                                                                        |
| monitoringType | string \| null  | Yes       | Patient follow-up classification.                                                                         |
| zipCode        | string \| null  | No        | Postal code (CEP).                                                                                        |
| state          | string \| null  | Yes       | Brazilian federation unit (UF).                                                                           |
| city           | string \| null  | Yes       | Municipality name.                                                                                        |
| neighborhood   | string \| null  | Yes       | District or neighborhood name.                                                                            |
| street         | string \| null  | Yes       | Public road name.                                                                                         |
| houseNumber    | string \| null  | Yes       | Residence number.                                                                                         |
| complement     | string \| null  | No        | Additional address details.                                                                               |
| ipAddress      | string \| null  | Yes       | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent      | string \| null  | Yes       | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |

**_Example:_**

```json
{
  "id": "patient-uuid",
  "name": "João da Silva",
  "cpf": "98765432100",
  "susCardNumber": "700000000000001",
  "socialName": null,
  "birthDate": "1985-05-20T00:00:00.000Z",
  "sex": "M",
  "gender": "Masculine",
  "sexuality": "Heterosexual",
  "race": "Pardo",
  "nationality": "Brasileira",
  "schooling": "Ensino Médio Completo",
  "phone": null,
  "email": null,
  "motherName": "Maria da Silva",
  "fatherName": null,
  "isDeceased": false,
  "monitoringType": "GENERAL",
  "zipCode": "01001-000",
  "state": "SP",
  "city": "São Paulo",
  "neighborhood": "Centro",
  "street": "Rua das Flores",
  "houseNumber": "123",
  "complement": null,
  "createdBy": "user-uuid",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": null,
  "deletedAt": null,
  "ipAddress": "192.168.0.10",
  "userAgent": "Mozilla/5.0"
}
```

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
  "id": "patient-uuid-generated-123",
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": null,
  "deletedAt": null
}
```

## `GET` Get a patient

Retrieves the full clinical and demographic identity of a patient, including audit metadata.

### **Endpoint**

```
/api/patients/:id
```

### **URL Params**

| Name | Type   | Description                        |
| :--- | :----- | :--------------------------------- |
| id   | string | Unique identifier for the patient. |

**_Example:_**

```bash
curl -X GET "{{baseUrl}}/api/patients/patient-uuid" \
  -H "Authorization: Bearer {{accessToken}}"
```

### **Response Body**

| Name           | Type            | Description                                |
| :------------- | :-------------- | :----------------------------------------- |
| id             | string \| null  | Unique identifier for the record.          |
| susCardNumber  | string \| null  | National Health Card ID (CNS).             |
| name           | string \| null  | Full legal name.                           |
| cpf            | string \| null  | Brazilian Taxpayer ID.                     |
| socialName     | string \| null  | Preferred or social name.                  |
| birthDate      | date \| null    | Patient's date of birth.                   |
| race           | string \| null  | Patient's declared color or race.          |
| sex            | string \| null  | Biological sex.                            |
| gender         | string \| null  | Gender identity.                           |
| sexuality      | string \| null  | Sexual orientation.                        |
| nationality    | string \| null  | Country of origin.                         |
| schooling      | string \| null  | Level of education.                        |
| phone          | string \| null  | Contact telephone number.                  |
| email          | string \| null  | Contact email address.                     |
| motherName     | string \| null  | Full mother's name.                        |
| fatherName     | string \| null  | Full father's name.                        |
| isDeceased     | boolean \| null | Death status flag.                         |
| monitoringType | string \| null  | Patient follow-up classification.          |
| zipCode        | string \| null  | Postal code (CEP).                         |
| state          | string \| null  | Brazilian federation unit (UF).            |
| city           | string \| null  | Municipality name.                         |
| neighborhood   | string \| null  | District or neighborhood name.             |
| street         | string \| null  | Public road name.                          |
| houseNumber    | string \| null  | Residence number.                          |
| complement     | string \| null  | Additional address details.                |
| createdBy      | string \| null  | ID of the user who created this record.    |
| createdAt      | date \| null    | Timestamp of record creation.              |
| updatedAt      | date \| null    | Timestamp of the last update.              |
| deletedAt      | date \| null    | Timestamp of soft-deletion, if applicable. |

**_Example:_**

```json
{
  "id": "patient-uuid",
  "name": "João da Silva",
  "cpf": "987.654.321-00",
  "susCardNumber": "700000000000001",
  "birthDate": "1985-05-20T00:00:00.000Z",
  "monitoringType": "GENERAL",
  "state": "SP",
  "city": "São Paulo",
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": null,
  "deletedAt": null
}
```

## `PATCH` Update a patient

Applies partial updates to a patient's demographic or monitoring data while maintaining the record's primary identifiers.

### **Endpoint**

```
/api/patients/:id
```

### **URL Params**

| Name | Type   | Description                        |
| :--- | :----- | :--------------------------------- |
| id   | string | Unique identifier for the patient. |

**_Example:_**

```bash
curl -X PATCH "{{baseUrl}}/api/patients/patient-uuid" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João da Silva Santos",
    "ipAddress": "192.168.0.10",
    "userAgent": "Mozilla/5.0"
  }'
```

### **Request Body**

| Name           | Type            | Mandatory | Description                                                                                               |
| :------------- | :-------------- | :-------- | :-------------------------------------------------------------------------------------------------------- |
| susCardNumber  | string \| null  | No        | National Health Card ID (CNS).                                                                            |
| name           | string \| null  | No        | Full legal name.                                                                                          |
| cpf            | string \| null  | No        | Brazilian Taxpayer ID.                                                                                    |
| socialName     | string \| null  | No        | Preferred or social name.                                                                                 |
| birthDate      | date \| null    | No        | Patient's date of birth.                                                                                  |
| race           | string \| null  | No        | Patient's declared color or race.                                                                         |
| sex            | string \| null  | No        | Biological sex.                                                                                           |
| gender         | string \| null  | No        | Gender identity.                                                                                          |
| sexuality      | string \| null  | No        | Sexual orientation.                                                                                       |
| nationality    | string \| null  | No        | Country of origin.                                                                                        |
| schooling      | string \| null  | No        | Level of education.                                                                                       |
| phone          | string \| null  | No        | Contact telephone number.                                                                                 |
| email          | string \| null  | No        | Contact email address.                                                                                    |
| motherName     | string \| null  | No        | Full mother's name.                                                                                       |
| fatherName     | string \| null  | No        | Full father's name.                                                                                       |
| isDeceased     | boolean \| null | No        | Death status flag.                                                                                        |
| monitoringType | string \| null  | No        | Patient follow-up classification.                                                                         |
| zipCode        | string \| null  | No        | Postal code (CEP).                                                                                        |
| state          | string \| null  | No        | Brazilian federation unit (UF).                                                                           |
| city           | string \| null  | No        | Municipality name.                                                                                        |
| neighborhood   | string \| null  | No        | District or neighborhood name.                                                                            |
| street         | string \| null  | No        | Public road name.                                                                                         |
| houseNumber    | string \| null  | No        | Residence number.                                                                                         |
| complement     | string \| null  | No        | Additional address details.                                                                               |
| ipAddress      | string \| null  | Yes       | Client's IP address, recorded as metadata for security tracking and forensic audit logs.                  |
| userAgent      | string \| null  | Yes       | Device and browser identifier string, recorded as metadata for security tracking and forensic audit logs. |

**_Example:_**

```json
{
  "id": "patient-uuid",
  "name": "João da Silva Santos",
  "cpf": "987.654.321-00",
  "socialName": "Joãozinho",
  "susCardNumber": "700000000000001",
  "monitoringType": "GENERAL",
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": "2026-01-18T11:00:00Z",
  "deletedAt": null,
  "ipAddress": "192.168.0.10",
  "userAgent": "Mozilla/5.0"
}
```

### **Response Body**

| Name           | Type           | Description                                |
| :------------- | :------------- | :----------------------------------------- |
| id             | string \| null | Unique identifier for the record.          |
| name           | string \| null | Full legal name.                           |
| cpf            | string \| null | Brazilian Taxpayer ID.                     |
| monitoringType | string \| null | Patient follow-up classification.          |
| createdBy      | string \| null | ID of the user who created this record.    |
| createdAt      | date \| null   | Timestamp of record creation.              |
| updatedAt      | date \| null   | Timestamp of the last update.              |
| deletedAt      | date \| null   | Timestamp of soft-deletion, if applicable. |

**_Example:_**

```json
{
  "id": "patient-uuid",
  "name": "João da Silva Santos",
  "cpf": "987.654.321-00",
  "monitoringType": "GENERAL",
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": "2026-01-18T11:00:00Z",
  "deletedAt": null
}
```

## `DELETE` Delete a patient

Marks a patient record as inactive via soft-deletion, preserving clinical history while removing the patient from active monitoring lists.

### **Endpoint**

```
/api/patients/:id
```

### **URL Params**

| Name | Type   | Description                        |
| :--- | :----- | :--------------------------------- |
| id   | string | Unique identifier for the patient. |

**_Example:_**

```bash
curl -X DELETE "{{baseUrl}}/api/patients/patient-uuid" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "ipAddress": "192.168.0.10",
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

## `PATCH` Restore a patient

Reverses the soft-deletion of a patient record, restoring their profile to active monitoring and clinical workflows.

### **Endpoint**

```
/api/patients/:id/restore
```

### **URL Params**

| Name | Type   | Description                        |
| :--- | :----- | :--------------------------------- |
| id   | string | Unique identifier for the patient. |

**_Example:_**

```bash
curl -X PATCH "{{baseUrl}}/api/patients/patient-uuid/restore" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "ipAddress": "192.168.0.10",
    "userAgent": "Mozilla/5.0"
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
| name      | string \| null | Full legal name.                           |
| cpf       | string \| null | Brazilian Taxpayer ID.                     |
| createdBy | string \| null | ID of the user who created this record.    |
| createdAt | date \| null   | Timestamp of record creation.              |
| updatedAt | date \| null   | Timestamp of the last update.              |
| deletedAt | date \| null   | Timestamp of soft-deletion, if applicable. |

**_Example:_**

```json
{
  "id": "patient-uuid",
  "name": "João da Silva Santos",
  "cpf": "987.654.321-00",
  "createdBy": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-18T10:00:00Z",
  "updatedAt": "2026-01-18T12:00:00Z",
  "deletedAt": null
}
```
