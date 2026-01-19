# Sessions

_Operational tracking of active system accesses and remote revocation._

## `GET` Find sessions

Lists currently active user sessions.

### **Endpoint**

```
/api/sessions
```

### **Query Params**

| Name           | Type    | Mandatory | Description                                          |
| :------------- | :------ | :-------- | :--------------------------------------------------- |
| page           | number  | No        | Results page numbering.                              |
| limit          | number  | No        | Items per results page.                              |
| search         | string  | No        | Filter search string for relevant record fields.     |
| userId         | string  | No        | Filter records for a specific user ID.               |
| includeDeleted | boolean | No        | Flag to include soft-deleted records in the results. |

**_Example:_**

```bash
curl -X GET "{{baseUrl}}/api/sessions?page=1&limit=20&search=189.1.2.3&userId=user-uuid&includeDeleted=false" \
  -H "Authorization: Bearer {{accessToken}}"
```

### **Response Body**

| Name  | Type              | Description                           |
| :---- | :---------------- | :------------------------------------ |
| items | session[] \| null | Array of operational session records. |
| total | number \| null    | Total count of sessions.              |

**_Example:_**

```json
{
  "items": [
    {
      "id": "session-uuid",
      "userId": "user-uuid",
      "issuedAt": "2026-01-17T10:00:00Z",
      "expiresAt": "2026-01-18T10:00:00Z",
      "ipAddress": "189.1.2.3",
      "userAgent": "Mozilla/5.0",
      "createdAt": "2026-01-17T10:00:00Z",
      "updatedAt": null,
      "deletedAt": null
    }
  ],
  "total": 1
}
```

## `DELETE` Revoke a session

Terminates an active user session by revoking its security tokens and forcing a re-authentication flow.

### **Endpoint**

```
/api/sessions/:id
```

### **URL Params**

| Name | Type   | Description                        |
| :--- | :----- | :--------------------------------- |
| id   | string | Unique identifier for the session. |

**_Example:_**

```bash
curl -X DELETE "{{baseUrl}}/api/sessions/session-uuid" \
  -H "Authorization: Bearer {{accessToken}}" \
  -H "Content-Type: application/json" \
  -d '{
    "ipAddress": "189.1.2.3",
    "userAgent": "Mozilla/5.0"
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
